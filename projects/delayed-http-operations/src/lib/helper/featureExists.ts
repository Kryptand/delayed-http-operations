import { DelayedHttpOperation } from "../models/delayed-http-operation";
export const featureExists = (featureName: string, delayedOperations: {
  [featureName: string]: DelayedHttpOperation[];
}): boolean => {
  if (featureName == null) {
    throw new Error("Feature name is not defined");
  }
  if (delayedOperations == null) {
    throw new Error("Delayedoperations Object is not defined");
  }
  return delayedOperations[featureName].length > 0 ? true : false;
};
