import { Injectable } from "@angular/core";
import {
  DelayedHttpOperation,
  HTTP_OPERATION_TYPE
} from "../models/delayed-http-operation";
import { HttpClient } from "@angular/common/http";
import { forkJoin, Observable, of } from "rxjs";
import { mergePutRequestIfExists } from "../helper/mergePutRequestIfExists";
import { getPreviousOperation } from "../helper/getPreviousOperation";
import { featureExists } from "../helper/featureExists";
import { executeIfHasOperation } from "../helper/executeIfHasOperation";

const ID_PROPERTY = "id";
@Injectable({
  providedIn: "root"
})
export class DelayedHttpOperationsService {
  constructor(private http: HttpClient) {}
  features: string[];
  delayedOperations: { [featureName: string]: DelayedHttpOperation[] } = {};
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

  public save(feature: string, requestUrl: string, saveObject: any): void {
    if (feature == null) {
      throw new Error("Feature is not defined");
    }
    if (requestUrl == null) {
      throw new Error("Request Url is not defined");
    }
    if (saveObject == null) {
      throw new Error("Save Object is not defined");
    }
    this.initializeMapForFeatureKey(feature);
    const delayedSaveRequest: DelayedHttpOperation = {
      operation: HTTP_OPERATION_TYPE.POST,
      url: requestUrl,
      originalBody: saveObject,
      id: saveObject.id
    };

    this.delayedOperations[feature] = [
      ...this.delayedOperations[feature],
      delayedSaveRequest
    ];
  }

  public delete(feature: string, requestUrl: string, id: string): void {
    if (feature == null) {
      throw new Error("Feature is not defined");
    }
    if (requestUrl == null) {
      throw new Error("Request Url is not defined");
    }
    if (id == null) {
      throw new Error("Save Object is not defined");
    }
    this.initializeMapForFeatureKey(feature);
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
    const hasPostOperation = executeIfHasOperation(
      feature,
      HTTP_OPERATION_TYPE.POST,
      HTTP_OPERATION_TYPE.REVOKEDPOST,
      id,
      this.delayedOperations
    );
    const hasPutOperation = executeIfHasOperation(
      feature,
      HTTP_OPERATION_TYPE.PUT,
      HTTP_OPERATION_TYPE.REVOKEDPUT,
      id,
      this.delayedOperations
    );
    if (!hasPostOperation && !hasPutOperation) {
      this.delayedOperations[feature] = [
        ...this.delayedOperations[feature],
        delayedDeleteRequest
      ];
    }
  }

  public revokeDelete(feature: string, id: string): void {
    if (feature == null) {
      throw new Error("Feature is not defined");
    }
    if (id == null) {
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
      executeIfHasOperation(
        feature,
        HTTP_OPERATION_TYPE.REVOKEDPOST,
        HTTP_OPERATION_TYPE.POST,
        id,
        this.delayedOperations
      );
      executeIfHasOperation(
        feature,
        HTTP_OPERATION_TYPE.REVOKEDPUT,
        HTTP_OPERATION_TYPE.PUT,
        id,
        this.delayedOperations
      );
    }
  }
  public update(feature: string, requestUrl: string, updateObject: any): void {
    if (feature == null) {
      throw new Error("Feature is not defined");
    }
    if (requestUrl == null) {
      throw new Error("Original Request is not defined");
    }
    if (updateObject == null) {
      throw new Error("Save Object is not defined");
    }
    const updateId = updateObject.id;
    if (!updateId) {
      throw new Error("Object does not include a primary identifier (id)");
    }

    this.initializeMapForFeatureKey(feature);
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
  }
  private initializeMapForFeatureKey(feature: string) {
    if (!this.delayedOperations[feature]) {
      this.delayedOperations[feature] = [];
    }
  }
  public resetFeature(feature:string){
    if(featureExists(feature,this.delayedOperations)){
      this.initializeMapForFeatureKey(feature);
    }
  }
  public resetAllFeatures(){
    this.delayedOperations = {};
  }
}
