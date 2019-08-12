import { DelayedHttpOperation } from '../models/delayed-http-operation'
import { throwIfNullOrUndefined } from './throwIfNullOrUndefined'
export const featureExists = (
  featureName: string,
  delayedOperations: {
    [featureName: string]: DelayedHttpOperation[]
  }
): boolean => {
  throwIfNullOrUndefined(featureName, 'feature')
  throwIfNullOrUndefined(delayedOperations, 'delayedOperations')
  return delayedOperations[featureName].length > 0 ? true : false
}
