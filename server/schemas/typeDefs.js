const { gql } = require("apollo-server-express");

//Defining the typeDefs in GraphQL schema
//Below I made some modifications to the fields to match up with the model field ie surfSpot is now surf_spot etc..and changed some Int or Numbers to Strings because I had made those kinds of changes to models to fit our data set.
const typeDefs = gql`
	type User {
		_id: ID
		username: String
		email: String
		password: String
	}

	type Auth {
		token: ID!
		user: User
	}

	type Query {
		user(username: String!): User!
		me: User
		location(surf_spot: String!): Location
	}

	type Comment {
		_id: ID
		comment: String
	}

	type Location {
		_id: ID
		surf_spot: String
		location: String
		type: String
		optimal_swell_direction: String
		optimal_wind: String
		optimal_swell_size: String
		optimal_tide: String
		comments: [Comment]
	}

	type Mutation {
		addUser(username: String!, email: String!, password: String!): Auth

		login(email: String!, password: String!): Auth

		addComment(userId: ID!, comment: String!): Location

		removeUser: User

		removeComment(comment: String!): Location

		addLocation(
			surf_spot: String!
			location: String!
			type: String!
			optimal_swell_direction: String!
			optimal_wind: String!
			optimal_swell_size: String!
			optimal_tide: String!
		): Auth
	}
`;

module.exports = typeDefs;

//below were lines 18 & 19
//username: [User]!
//username(userId: ID!): User
