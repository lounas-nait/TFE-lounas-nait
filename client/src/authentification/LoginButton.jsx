import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({ className }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button onClick={() => loginWithRedirect()} className={className}>
      Connexion
    </button>
  );
};

export default LoginButton;
