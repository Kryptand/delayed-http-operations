import {
  DelayedHttpOperation,
  HTTP_OPERATION_TYPE,
} from '../models/delayed-http-operation'
import { throwIfNullOrUndefined } from './throwIfNullOrUndefined'
export const getPreviousOperation = (
  featureName: string,
  operationType: HTTP_OPERATION_TYPE,
  id: string,
  delayedOperations: {
    [featureName: string]: DelayedHttpOperation[]
  }
): DelayedHttpOperation => {
  throwIfNullOrUndefined(featureName, 'featureName')
  throwIfNullOrUndefined(id, 'id')
  throwIfNullOrUndefined(operationType, 'operationType')
  throwIfNullOrUndefined(delayedOperations, 'delayedOperations')

  if (delayedOperations[featureName] == null) {
    return null
  }
  return delayedOperations[featureName].find(
    x => x.operation === operationType && x.id === id
  )
}
