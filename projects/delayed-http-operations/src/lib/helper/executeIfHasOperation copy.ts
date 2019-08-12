import {
  DelayedHttpOperation,
  HTTP_OPERATION_TYPE,
} from '../models/delayed-http-operation'
import { getPreviousOperation } from './getPreviousOperation'
import { throwIfNullOrUndefined } from './throwIfNullOrUndefined'
export const executeIfHasOperation = (
  feature: string,
  operationType: HTTP_OPERATION_TYPE,
  revokedType: HTTP_OPERATION_TYPE,
  id: string,
  delayedOperations: {
    [featureName: string]: DelayedHttpOperation[]
  }
): DelayedHttpOperation => {
  throwIfNullOrUndefined(feature, 'feature')
  throwIfNullOrUndefined(id, 'id')
  throwIfNullOrUndefined(operationType, 'operationType')
  throwIfNullOrUndefined(revokedType, 'revokedType')
  throwIfNullOrUndefined(delayedOperations, 'delayedOperations')

  const hasOperation = getPreviousOperation(
    feature,
    operationType,
    id,
    delayedOperations
  )
  if (hasOperation) {
    delayedOperations[feature] = delayedOperations[feature].filter(
      x => !(x.id === hasOperation.id && x.operation === operationType)
    )
    hasOperation.operation = revokedType
    delayedOperations[feature] = [...delayedOperations[feature], hasOperation]
  }
  return hasOperation
}
