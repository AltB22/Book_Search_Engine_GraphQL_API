const express = require('express');
const app = express();

const path = require('path');

require('dotenv').config({ path: __dirname+"/../.env" });

const PORT = process.env.PORT || 3001;
const { authMiddleware } = require('./utils/auth');
const { ApolloServer } = require('apollo-server-express');//added ApolloServer import

// const routes = require('./routes');//commented out routes as unncessary with graphql resolvers

const { typeDefs, resolvers } = require('./schemas');//imports the type definitions and resolvers for use in gql schema
const db = require('./config/connection');


const server = new ApolloServer({//creates new instance of ApolloServer using typeDefs, resolvers and authentication middleware
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);not needed

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  //starts the server and listens for incoming requests. Once connection established, app listens on the specified port.
  db.once('open', () => {
    app.listen(PORT, () => console.log(`Now listening on localhost: ${PORT}`));
  });
}
startApolloServer(typeDefs, resolvers);