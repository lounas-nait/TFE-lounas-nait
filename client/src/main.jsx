import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { CartProvider } from './components/context/CartContext'
import { Auth0Provider } from '@auth0/auth0-react';
import { NotificationProvider } from './components/context/NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
  domain={import.meta.env.VITE_AUTH0_DOMAIN}
  clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
  useRefreshTokens={true}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    }}
  >
  <React.StrictMode>
    <CartProvider>
    <NotificationProvider>
      <App />
      </NotificationProvider>
    </CartProvider>
  </React.StrictMode>
  </Auth0Provider>
)
