import React, { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings'; 
import { FaUserCircle } from 'react-icons/fa';
import { useAuth0 } from "@auth0/auth0-react";
import { AiFillDelete } from "react-icons/ai";
import useSWR from 'swr';

const AvisList = ({ avis }) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [clients, setClients] = useState({});
  
  useEffect(() => {
    // Récupération des détails des clients pour chaque avis seulement si l'utilisateur est connecté
    if (isAuthenticated) {
      avis.forEach((avisItem) => {
        if (!clients[avisItem.client]) {
          fetchClient(avisItem.client);
        }
      });
    }
  }, [avis, isAuthenticated]); // Réexécute l'effet lorsque les avis ou l'état d'authentification changent

  const fetchClient = async (clientId) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/api/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch client data');
      }
      const clientData = await response.json();
      setClients(prevClients => ({
        ...prevClients,
        [clientId]: clientData.nom // Stocke le nom du client par ID dans l'état local
      }));
    } catch (error) {
      console.error('Failed to fetch client:', error);
    }
  };

  const reversedAvis = [...avis].reverse();

  const isAdmin = isAuthenticated && user.email && user.email.startsWith('admin');

  const handleDeleteAvis = (id) => {
    // Logique pour supprimer l'avis avec l'ID spécifié
  };

  return (
    <div className="w-1/2 pr-4">
      <h2 className="text-xl font-semibold mb-4">Avis des clients</h2>
      {reversedAvis.length > 0 ? (
        reversedAvis.map((avisItem) => (
          <div key={avisItem.id} className="mb-4 p-4 border border-gray-300 rounded-md relative">
            {isAdmin && (
              <button
                className="absolute top-0 right-0 m-2 focus:outline-none text-red-500"
                onClick={() => handleDeleteAvis(avisItem.id)}
              >
                <AiFillDelete size="1.7em" />
              </button>
            )}
            <div className="flex items-center mb-2">
              <FaUserCircle className="mr-2" size="1.7em" /> 
              <p className="text-sm font-semibold">{isAuthenticated ? clients[avisItem.client] : 'user'}</p>
            </div>
            <div className="flex items-center mb-2">
              <StarRatings
                rating={avisItem.note}
                starRatedColor="gold"
                numberOfStars={5}
                name='rating'
                starDimension="17px"
                starSpacing="2px"
              />
            </div>
            <p className="text-sm">{avisItem.commentaire}</p>
          </div>
        ))
      ) : (
        <div>Aucun avis pour cet instrument.</div>
      )}
    </div>
  );
};

export default AvisList;
