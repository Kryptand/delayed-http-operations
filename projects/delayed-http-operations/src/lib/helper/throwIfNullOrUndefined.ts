export const throwIfNullOrUndefined = (feature: any, featureName: string) => {
  if (feature == null) {
    throw new Error(`${featureName} is not defined`)
  }
}
