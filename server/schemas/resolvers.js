const { AuthenticationError } = require("apollo-server-express");
const { User, Comment, Location } = require("../models");
const { signToken } = require("../utils/auth");

//defines the resolvers
const resolvers = {
	//query is like get routes, handles retreival of data from the server.  It is itself an object that contains multiple resolvers for retreiving data.
	Query: {
		user: async () => {
			return User.find();
		},
		// user: async (parent, { userId }) => {//commented this out for now until we can sort it out. - Billy
		// 	return User.findOne({ _id: userId });
		// },
		me: async (parent, args, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id }); //we may need to adjust this to context.userId - Billy
			}
			throw new AuthenticationError("You need to be logged in!");
		},
		//added Location to match the TypeDefs so that we can find one location. - Bax
		location: async (parent, { surf_spot }) => {
			return Location.findOne({ surf_spot });
		},
		user: async (parent, { username }) => {
			// Added this resolver for the new 'user' field - Billy Isnt this done on line 8? -Bax - it's find all v. find one. -Billy
			return User.findOne({ username });
		},
	},

	//Defines the Mutations
	//Mutations are like post, put, & delelte routes.  It is itself an object that contains multiple resolvers for modifying data on the server.

	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });
			if (!user) {
				throw new AuthenticationError("No user with this email found!");
			}
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) {
				throw new AuthenticationError("Incorrect password!");
			}
			const token = signToken(user);
			return { token, user };
		},
		addComment: async (parent, { locationId, comment }, context) => {
			if (context.user) {
				return Location.findOneAndUpdate(
					{ _id: locationId },
					{
						$addToSet: { comments: { comment, user: context.user._id } },
					},
					{
						new: true,
						runValidators: true,
					}
				);
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

		removeUser: async (parent, args, context) => {
			if (context.user) {
				return User.findOneAndDelete({ _id: context.user._id }); //we may need to adjust this to context.userId - Billy
			}
			throw new AuthenticationError("You need to be logged in!");
		},
		removeComment: async (parent, {locationId, comment }, context) => {
			if (context.user) {
				return Location.findOneAndUpdate(
					{ _id: locationId }, //we may need to adjust this to context.locationId - Billy this may work now -Bax
					{ $pull: { comments: {_id: comment }} },
					{ new: true }
				);
			}
			throw new AuthenticationError("You need to be logged in!");
		},
	},
};

module.exports = resolvers;
