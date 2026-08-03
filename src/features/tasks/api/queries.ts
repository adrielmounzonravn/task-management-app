import { graphql } from '@/gql/gql'

export const GET_TASKS = graphql(`
  query Tasks($input: FilterTaskInput!) {
    tasks(input: $input) {
      id
      name
      pointEstimate
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
