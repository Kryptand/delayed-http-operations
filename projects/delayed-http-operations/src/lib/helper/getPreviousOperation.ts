import { DelayedHttpOperation, HTTP_OPERATION_TYPE } from "../models/delayed-http-operation";
export const getPreviousOperation = (featureName: string, operationType: HTTP_OPERATION_TYPE, id: string, delayedOperations: {
  [featureName: string]: DelayedHttpOperation[];
}): DelayedHttpOperation => {
  if (!featureName) {
    throw new Error("Feature name is not defined");
  }
  console.debug(operationType);
  if (!operationType) {
    throw new Error("Operation type is not defined");
  }
  if (!delayedOperations) {
    throw new Error("Delayedoperations Object is not defined");
  }
  if(!delayedOperations[featureName]){
    return null;
  }
  return delayedOperations[featureName].find(x => x.operation === operationType && x.id === id);
};
