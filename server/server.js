const express = require('express');
const { ApolloServer } = require('apollo-server-express');//added ApolloServer import
const { authMiddleware } = require('./utils/auth');
const path = require('path');

const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');//imports the type definitions and resolvers for use in gql schema

const PORT = process.env.PORT || 3001;
const app = express();
// const routes = require('./routes');//commented out routes as unncessary with graphql resolvers
const server = new ApolloServer({//creates new instance of ApolloServer using typeDefs, resolvers and authentication middleware
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.use(routes);not needed

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });//applies Apollo Server to Express server as middleware.
  //once server is started listens for incoming requests. Once connection established, app listens on the specified port.
  db.once('open', () => {
    app.listen(PORT, () => {
    console.log(`Now listening on localhost: ${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}
// Call the async function to start the server
startApolloServer(typeDefs, resolvers);