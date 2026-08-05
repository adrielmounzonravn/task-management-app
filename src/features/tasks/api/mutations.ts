import { graphql } from '@/gql/gql'

export const CREATE_TASK = graphql(`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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
