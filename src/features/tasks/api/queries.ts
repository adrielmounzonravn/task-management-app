import { graphql } from '@/gql/gql'

export const GET_TASKS = graphql(`
  query Tasks($input: FilterTaskInput!) {
    tasks(input: $input) {
      id
      name
      pointEstimate
      position
      status
      dueDate
      tags
      assignee {
        id
        fullName
        avatar
      }
    }
  }
`)

export const GET_USERS = graphql(`
  query Users {
    users {
      id
      fullName
    }
  }
`)
