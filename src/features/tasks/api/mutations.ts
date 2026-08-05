import { graphql } from '@/gql/gql'

export const CREATE_TASK = graphql(`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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

export const UPDATE_TASK = graphql(`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
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

export const DELETE_TASK = graphql(`
  mutation DeleteTask($input: DeleteTaskInput!) {
    deleteTask(input: $input) {
      id
    }
  }
`)
