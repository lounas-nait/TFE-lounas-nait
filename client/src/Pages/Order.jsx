import React from 'react';
import { NavLink } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { useAuth0 } from "@auth0/auth0-react";
import MesCommandes from '../components/commandes/MesCommandes';
import LoginButton from '../authentification/LoginButton';

export function Order() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div className='ml-[80px]'>
          <MesCommandes />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-screen'>
          <h2 className='mb-4 text-xl'>Connectez-vous pour consulter vos commandes</h2>
          <LoginButton className="bg-blue-500 text-white py-2 px-4 rounded" />
        </div>
      )}
    </div>
  );
}
