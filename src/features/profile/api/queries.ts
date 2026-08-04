import { graphql } from '@/gql/gql'

export const GET_PROFILE = graphql(`
  query Profile {
    profile {
      id
      fullName
      email
      avatar
      type
      createdAt
    }
  }
`)
