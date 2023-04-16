import { Routes,Route, BrowserRouter } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
// import Login from './components/LoginForm'
// import Signup from './components/SignupForm'
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: '/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
 link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  
});



function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <>
          <Navbar />
          <Routes>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Routes>
        </>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;