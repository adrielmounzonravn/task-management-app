import { ApolloClient, ApolloLink } from '@apollo/client'
import { authLink } from '@/app/apollo/authLink'
import { errorLink } from '@/app/apollo/errorLink'
import { httpLink } from '@/app/apollo/httpLink'
import { cache } from '@/app/apollo/cache'

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache,
})
