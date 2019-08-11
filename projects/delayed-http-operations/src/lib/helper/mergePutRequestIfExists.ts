import { DelayedHttpOperation, HTTP_OPERATION_TYPE } from "../models/delayed-http-operation";
import { getPreviousOperation } from './getPreviousOperation';


export const mergePutRequestIfExists = (feature: string, updateId: any, delayedPutRequest: DelayedHttpOperation, delayedOperations: {
  [featureName: string]: DelayedHttpOperation[];
}) => {
  const previousPut = getPreviousOperation(feature, HTTP_OPERATION_TYPE.PUT, updateId, delayedOperations);
  if (previousPut) {
    return (delayedOperations[feature].find(x => x.operation === HTTP_OPERATION_TYPE.PUT && x.id === previousPut.id).originalBody = {
      ...previousPut.originalBody,
      ...delayedPutRequest.originalBody
    });
  }
  delayedOperations[feature] = [
    ...delayedOperations[feature],
    delayedPutRequest
  ];
};
