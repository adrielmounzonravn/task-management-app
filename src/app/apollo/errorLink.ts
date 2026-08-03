import { ErrorLink } from '@apollo/client/link/error'
import { CombinedGraphQLErrors } from '@apollo/client/errors'

export const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const isUnauthenticated = error.errors.some(
      (graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED',
    )
    if (isUnauthenticated) {
      console.error(`[GraphQL] invalid or missing token in "${operation.operationName}"`)
      return
    }
    console.error(`[GraphQL error] in "${operation.operationName}": ${error.message}`)
    return
  }
  console.error(`[Network error] in "${operation.operationName}": ${error.message}`)
})
