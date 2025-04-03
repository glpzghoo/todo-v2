import { gql } from "@apollo/client";
// mutat
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
        user {
          id
          username
        }
      }
      user {
        username
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
export const RESIGSTER = gql`
  mutation Mutation($username: String!, $password: String!) {
    newUser(username: $username, password: $password) {
      code
      message
      success
      user {
        username
        id
      }
    }
  }
`;
export const UPDATE_TODO = gql`
  mutation Mutation(
    $id: String!
    $jwt: String!
    $description: String
    $tagId: String
    $priority: Int
    $taskName: String
  ) {
    updateTodo(
      id: $id
      jwt: $jwt
      description: $description
      priority: $priority
      taskName: $taskName
      tagId: $tagId
    ) {
      code
      message
      success
      todo {
        cancelled
        createdAt
        description
        id
        priority
        isDone
        taskName
      }
    }
  }
`;

// queries
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
export const FETCH_TODOS = gql`
  query Query {
    guests {
      cancelled
      createdAt
      description
      isDone
      id
      priority
      taskName
      updatedAt
      tag {
        id
        name
      }
    }
  }
`;
export const EDIT_GUEST_TODO = gql`
  mutation Mutation(
    $id: String!
    $description: String
    $priority: Int
    $taskName: String
    $tagId: String
  ) {
    editGuestTodo(
      id: $id
      description: $description
      priority: $priority
      taskName: $taskName
      tagId: $tagId
    ) {
      id
    }
  }
`;
export const CANCEL_GUEST_TODO = gql`
  mutation CancelGuestTodo($id: String!) {
    cancelGuestTodo(id: $id) {
      cancelled
      createdAt
      updatedAt
    }
  }
`;
export const DONE_GUEST_TODO = gql`
  mutation doneGuestTodo($id: String!) {
    doneGuestTodo(id: $id) {
      id
    }
  }
`;
export const ADD_GUEST_TODO = gql`
  mutation Mutation(
    $description: String!
    $priority: Int!
    $taskName: String!
    $tagId: String!
  ) {
    addNewGuestTodo(
      description: $description
      priority: $priority
      taskName: $taskName
      tagId: $tagId
    ) {
      id
    }
  }
`;
