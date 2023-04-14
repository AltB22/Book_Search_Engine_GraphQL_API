const { gql } = require("apollo-server-express");

//Defining the typeDefs in GraphQL schema
const typeDefs = gql`
	type User {
		_id: ID
		username: String
		email: String
		password: String
		savedBooks: [Book]
	}

	type Auth {
		token: ID!
		user: User
	}

	type Book {
		bookId: ID!
		title: String!
		authors: [String]
		description: String
		image: String
		link: String
	}

	type saveBook {
		bookId: ID!
		title: String!
		authors: [String!]!
		description: String
		image: String
		link: String
	}

	type Query {}
		me: User
	}

	type Mutation {
		addUser(username: String!, email: String!, password: String!): Auth

		login(email: String!, password: String!): Auth

		addBook(newBook: saveBook!): User

		removeBook:(bookId: ID!): User

	}
`;

module.exports = typeDefs;

