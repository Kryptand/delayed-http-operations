import {
  DelayedHttpOperation,
  HTTP_OPERATION_TYPE
} from "../models/delayed-http-operation";
import { getPreviousOperation } from "./getPreviousOperation";
export const executeIfHasOperation = (
  feature: string,
  operationType: HTTP_OPERATION_TYPE,
  revokedType: HTTP_OPERATION_TYPE,
  id: string,
  delayedOperations: {
    [featureName: string]: DelayedHttpOperation[];
  }
): DelayedHttpOperation => {
  if (feature == null) {
    throw new Error("feature is not defined");
  }
  if (id == null) {
    throw new Error("id is not defined");
  }
  if (operationType == null) {
    throw new Error("operationType is not defined");
  }
  if (revokedType == null) {
    throw new Error("revokedType is not defined");
  }
  if (delayedOperations == null) {
    throw new Error("delayedOperations is not defined");
  }
  const hasOperation = getPreviousOperation(
    feature,
    operationType,
    id,
    delayedOperations
  );
  if (hasOperation) {
    delayedOperations[feature] = delayedOperations[feature].filter(
      x => !(x.id === hasOperation.id && x.operation === operationType)
    );
    hasOperation.operation = revokedType;
    delayedOperations[feature] = [...delayedOperations[feature], hasOperation];
  }
  return hasOperation;
};
