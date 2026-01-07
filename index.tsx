
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Adicionada a extensão .tsx para facilitar a resolução no build da Vercel

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
