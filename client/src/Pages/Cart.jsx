import React from 'react';
import Cartitems from '../components/panier/Cartitems';
import LoginButton from '../authentification/LoginButton';
import { useAuth0 } from "@auth0/auth0-react";
import CartitemsLocal from '../components/panier/CartItemsLocal';

export function Cart() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div className='ml-[80px]'>
        <Cartitems /></div>
      ) : (
        <div className='ml-[80px]'>
      
              <CartitemsLocal />
           
        </div>
      )}
    </div>
  );
}
