import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

// const rootElement = document.getElementById('root')

// if(rootElement)
document.addEventListener('DOMContentLoaded', function() {
  ReactDOMClient.createRoot(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
});