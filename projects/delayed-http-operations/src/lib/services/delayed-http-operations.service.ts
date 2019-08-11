import { Injectable } from "@angular/core";
import {
  DelayedHttpOperation,
  HTTP_OPERATION_TYPE
} from "../models/delayed-http-operation";
import { HttpClient } from "@angular/common/http";
import { forkJoin, Observable, of } from "rxjs";
import { mergePutRequestIfExists } from '../helper/mergePutRequestIfExists';
import { getPreviousOperation } from '../helper/getPreviousOperation';
import { featureExists } from '../helper/featureExists';

const ID_PROPERTY = "id";

@Injectable({
  providedIn: "root"
})
export class DelayedHttpOperationsService {
  constructor(private http: HttpClient) {}
  features: string[];
  delayedOperations: { [featureName: string]: DelayedHttpOperation[] }={};
  public execute(feature: string): Observable<any[]> {
    if (this.delayedOperations[feature].length > 0) {
      const operations = this.delayedOperations[feature].filter(
        x =>
          x.operation !== HTTP_OPERATION_TYPE.REVOKEDPOST &&
          x.operation !== HTTP_OPERATION_TYPE.REVOKEDPUT
      );
      return forkJoin(
        operations.map(x => {
          if (x.operation === HTTP_OPERATION_TYPE.POST) {
            return this.http.post(x.url, x.originalBody);
          }
          if (x.operation === HTTP_OPERATION_TYPE.DELETE) {
            return this.http.delete(`${x.url}?${ID_PROPERTY}=${x.id}`);
          }
          if (x.operation === HTTP_OPERATION_TYPE.PUT) {
            return this.http.put(x.url, x.originalBody);
          }
        })
      );
    }
    return of([]);
  }
  public save(feature: string, requestUrl: string, saveObject: any):void {
    if (!feature) {
      throw new Error("Feature is not defined");
    }
    if (!requestUrl) {
      throw new Error("Request Url is not defined");
    }
    if (!saveObject) {
      throw new Error("Save Object is not defined");
    }
    const delayedSaveRequest: DelayedHttpOperation = {
      operation: HTTP_OPERATION_TYPE.POST,
      url: requestUrl,
      originalBody: saveObject,
      id: saveObject.id
    };
    console.debug(feature);
    if(!this.delayedOperations[feature]){
      this.delayedOperations[feature]=[];
    }
    this.delayedOperations[feature] = [
      ...this.delayedOperations[feature],
      delayedSaveRequest
    ];
    console.debug(this.delayedOperations[feature]);
  }
  public delete(feature: string, requestUrl: string, id: string):void {
    if (!feature) {
      throw new Error("Feature is not defined");
    }
    if (!requestUrl) {
      throw new Error("Request Url is not defined");
    }
    if (!id) {
      throw new Error("Save Object is not defined");
    }
    const delayedDeleteRequest: DelayedHttpOperation = {
      operation: HTTP_OPERATION_TYPE.DELETE,
      url: requestUrl,
      id: id
    };
    const hasDeleteOperation = getPreviousOperation(
      feature,
      HTTP_OPERATION_TYPE.DELETE,
      id,
      this.delayedOperations
    );
    if (hasDeleteOperation) {
      return;
    }
    const hasPostOperation = getPreviousOperation(
      feature,
      HTTP_OPERATION_TYPE.POST,
      id,
      this.delayedOperations
    );
    if (hasPostOperation) {
      this.delayedOperations[feature] = this.delayedOperations[feature].filter(
        x =>
          !(
            x.id === hasPostOperation.id &&
            x.operation === HTTP_OPERATION_TYPE.POST
          )
      );
      hasPostOperation.operation = HTTP_OPERATION_TYPE.REVOKEDPOST;
      this.delayedOperations[feature] = [
        ...this.delayedOperations[feature],
        hasPostOperation
      ];
    }
    const hasPutOperation = getPreviousOperation(
      feature,
      HTTP_OPERATION_TYPE.PUT,
      id,
      this.delayedOperations
    );
    if (hasPutOperation) {
      this.delayedOperations[feature] = this.delayedOperations[feature].filter(
        x =>
          !(
            x.id === hasPutOperation.id &&
            x.operation === HTTP_OPERATION_TYPE.POST
          )
      );
      hasPutOperation.operation = HTTP_OPERATION_TYPE.REVOKEDPUT;
      this.delayedOperations[feature] = [
        ...this.delayedOperations[feature],
        hasPutOperation
      ];
    }
    if (!hasPostOperation && !hasPutOperation) {
      this.delayedOperations[feature] = [
        ...this.delayedOperations[feature],
        delayedDeleteRequest
      ];
    }

    console.debug(this.delayedOperations[feature]);
  }
  public revokeDelete(feature: string, id: string):void {
    if (!feature) {
      throw new Error("Feature is not defined");
    }
    if (!id) {
      throw new Error("Save Object is not defined");
    }
    if (featureExists(feature, this.delayedOperations)) {
      const hasDeleteOperation = getPreviousOperation(
        feature,
        HTTP_OPERATION_TYPE.DELETE,
        id,
        this.delayedOperations
      );
      if (hasDeleteOperation) {
        this.delayedOperations[feature] = this.delayedOperations[
          feature
        ].filter(
          x => !(x.operation === HTTP_OPERATION_TYPE.DELETE && x.id === id)
        );
      }
      const hasRevokedPostOperation = getPreviousOperation(
        feature,
        HTTP_OPERATION_TYPE.REVOKEDPOST,
        id,
        this.delayedOperations
      );
      if (hasRevokedPostOperation) {
        hasRevokedPostOperation.operation = HTTP_OPERATION_TYPE.POST;
        this.delayedOperations[feature] = this.delayedOperations[
          feature
        ].filter(
          x => !(x.operation === HTTP_OPERATION_TYPE.REVOKEDPOST && x.id === id)
        );
        this.delayedOperations[feature] = [
          ...this.delayedOperations[feature],
          hasRevokedPostOperation
        ];
      }
      const hasRevokedPutOperation = getPreviousOperation(
        feature,
        HTTP_OPERATION_TYPE.REVOKEDPUT,
        id,
        this.delayedOperations
      );
      hasRevokedPutOperation.operation = HTTP_OPERATION_TYPE.PUT;
      this.delayedOperations[feature] = this.delayedOperations[feature].filter(
        x => !(x.operation === HTTP_OPERATION_TYPE.REVOKEDPUT && x.id === id)
      );
      this.delayedOperations[feature] = [
        ...this.delayedOperations[feature],
        hasRevokedPutOperation
      ];
      console.debug(this.delayedOperations[feature]);
    }
  }
  public update(feature: string, requestUrl: string, updateObject: any):void {
    if (!feature) {
      throw new Error("Feature is not defined");
    }
    if (!requestUrl) {
      throw new Error("Original Request is not defined");
    }
    if (!updateObject) {
      throw new Error("Save Object is not defined");
    }
    const updateId = updateObject.id;
    if (!updateId) {
      throw new Error("Object does not include a primary identifier (id)");
    }
    const delayedPutRequest: DelayedHttpOperation = {
      operation: HTTP_OPERATION_TYPE.PUT,
      url: requestUrl,
      originalBody: updateObject,
      id: updateId
    };
    mergePutRequestIfExists(
      feature,
      updateId,
      delayedPutRequest,
      this.delayedOperations
    );

    console.debug(this.delayedOperations[feature]);
  }
}
