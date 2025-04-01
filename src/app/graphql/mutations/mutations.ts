import { gql } from "@apollo/client";

export const addNew = gql`
  mutation Mutation(
    $description: String!
    $priority: Int!
    $taskName: String!
    $tagId: String!
    $jwt: String!
  ) {
    addTodo(
      description: $description
      priority: $priority
      taskName: $taskName
      tagId: $tagId
      jwt: $jwt
    ) {
      code
      message
      success
      todo {
        cancelled
        createdAt
        description
        id
        isDone
        priority
        taskName
        tag {
          id
          name
        }
      }
    }
  }
`;
export const USER_TODO = gql`
  mutation Mutation($jwt: String!) {
    userTodo(jwt: $jwt) {
      message
      success
      todos {
        description
        id
        isDone
        priority
        createdAt
        cancelled
        tag {
          name
          id
        }
        taskName
      }
      user {
        username
        id
      }
    }
  }
`;
export const FETCH_TAGS = gql`
  query Query {
    tag {
      code
      message
      success
      tags {
        name
        id
      }
    }
  }
`;
export const CANCEL_TODO = gql`
  mutation Mutation($id: String!, $jwt: String!) {
    cancelTodo(id: $id, jwt: $jwt) {
      code
      message
      success
      todo {
        cancelled
        createdAt
        description
        id
        isDone
        priority
        taskName
      }
    }
  }
`;
export const UPDATE_STATUS = gql`
  mutation Mutation($todoId: String!, $jwt: String!) {
    updateStatus(todoId: $todoId, jwt: $jwt) {
      code
      message
      success
      todo {
        createdAt
        description
        isDone
        priority
        taskName
      }
    }
  }
`;
export const LOGIN_USER = gql`
  mutation Mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      JWT
      code
      message
      success
      user {
        username
        todo {
          description
          id
          isDone
          priority
          taskName
          tag {
            name
            id
          }
        }
      }
    }
  }
`;
