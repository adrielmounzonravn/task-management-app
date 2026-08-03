import { type ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from '@/app/apollo/client'

export function Providers({ children }: { children: ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
