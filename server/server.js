const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');//added ApolloServer import
const { authMiddleware } = require('./utils/auth');

// const routes = require('./routes');//commented out routes as unncessary with graphql resolvers

const cors = require('cors');//added cors for cross origin resources
const { typeDefs, resolvers } = require('./schemas');//imports the type definitions and resolvers for use in gql schema
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;


const server = new ApolloServer({//creates new instance of ApolloServer using typeDefs, resolvers and authentication middleware
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);not needed

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

//Added error handling middleware for unhandled errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});