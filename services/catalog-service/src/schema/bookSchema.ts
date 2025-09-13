import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    price: Float!
    description: String!
    stock: Int!
    isbn: String!
    category: String!
    publishedDate: String!
    createdAt: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    searchBooks(query: String!): [Book!]!
    booksByCategory(category: String!): [Book!]!
    categories: [String!]!
  }

  input BookInput {
    title: String!
    author: String!
    price: Float!
    description: String!
    stock: Int!
    isbn: String!
    category: String!
    publishedDate: String!
  }

  type Mutation {
    addBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookInput!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;