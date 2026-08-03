import { HttpLink } from '@apollo/client'

export const httpLink = new HttpLink({
  uri: 'https://syn-api-production-e95c.up.railway.app/graphql',
})
