import React from 'react';
import Cartitems from '../components/panier/Cartitems';
import LoginButton from '../authentification/LoginButton';
import { useAuth0 } from "@auth0/auth0-react";

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
        <div className="w-full h-screen flex justify-center items-center">
          <div className="space-y-5 flex flex-col justify-center items-center">
            <div className="bg-gray-800 text-white px-5 py-2 rounded-md drop-shadow-xl flex items-center space-x-2">
              <LoginButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
