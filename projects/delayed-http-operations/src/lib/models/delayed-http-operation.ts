export const enum HTTP_OPERATION_TYPE {
  'POST',
  'REVOKEDPOST',
  'REVOKEDPUT',
  'PUT',
  'DELETE',
}
export interface DelayedHttpOperation {
  operation: HTTP_OPERATION_TYPE
  url: string
  originalBody?: any
  id?: string
}
