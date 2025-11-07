/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserStats = /* GraphQL */ `
  query GetUserStats {
    getUserStats {
      totalUsers
      activeUsers
      recentSignups
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      bio
      location
      skills
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        bio
        location
        skills
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
