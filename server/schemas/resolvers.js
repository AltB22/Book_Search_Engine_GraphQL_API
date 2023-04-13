const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

//Below defines the resolvers
const resolvers = {
	//Defining the query.  Query is like get routes, handles retreival of data from the server.  It is itself an object that contains multiple resolvers for retreiving data.
	Query: {
		me: async (parent, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id })
					.select("-__v -password")
					.populate("books");

			}
			throw new AuthenticationError('You must be logged in!');
		},
	},

	// Defines the Mutations:
	//Mutations are like post, put, & delete routes.  It is itself an object that contains multiple resolvers for modifying data on the server.

	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });
			if (!user) {
				throw new AuthenticationError("User not found!");
			}
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) {
				throw new AuthenticationError("Incorrect password!");
			}
			const token = signToken(user);
			return { token, user };
		},
		saveBook: async (parent, args, context) => {
			if (context.user) {
				const updateBookToUser = await User.findByIdAndUpdate(

					{ _id: context.user._idId },
					{ $addToSet: { savedBooks: args.input } },
					{ new: true, runValidators: true }
				);

				return updatedUser;
			}
			throw new AuthenticationError("You need to be logged in!");
		},
		addLocation: async (parent, args, context) => {
			if (context.user) {
				const location = await Location.create({
					...args,
					user: context.user._id, //we may need to adjust this to context.userId - Billy
				});
				return location;
			}
			throw new AuthenticationError("You need to be logged in!");
		},

		removeBook: async (parent, { locationId, comment }, context) => {
			if (context.user) {
				return Location.findOneAndUpdate(
					{ _id: locationId }, //we may need to adjust this to context.locationId - Billy this may work now -Bax
					{ $pull: { comments: { _id: comment } } },
					{ new: true }
				);
			}
			throw new AuthenticationError("You need to be logged in!");
		},
	},
};

module.exports = resolvers;
