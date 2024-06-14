import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { mutate } from 'swr';
import AvisList from './AvisList';
import AddAvisForm from './AddAvisForm';

const AddAvis = () => {
  const { id } = useParams();  // id de l'instrument
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const fetcher = async (url) => {
    const options = {
      headers: {
        Accept: 'application/json',
      },
    };

    if (isAuthenticated) {
      const accessToken = await getAccessTokenSilently();
      options.headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  };

  const fetchInstrument = async (url) => {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  };

  const { data: clientData, error: clientError } = useSWR('/api/clients', fetcher);
  const { data: instrumentsData, error: instrumentsError } = useSWR('/api/instruments?size=1000', fetchInstrument);

  console.log(clientData);

  if (clientError) {
    return <div className="text-red-500">Erreur lors de la récupération des données du client.</div>;
  }

  if (instrumentsError) {
    return <div className="text-red-500">Erreur lors de la récupération des données des instruments.</div>;
  }

  if (!clientData || !instrumentsData) {
    return <div>Chargement...</div>;
  }

  const instrumentList = instrumentsData.content || instrumentsData; 
  const instrument = Array.isArray(instrumentList) ? instrumentList.find((instrument) => instrument.id === id) : null;

  const handleReviewSubmitted = () => {
    mutate('/api/instruments?size=1000');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 flex">
      {instrument && <AvisList avis={instrument.avis} />}
      {(
        <AddAvisForm 
          clientId={clientData.id} 
          instrumentId={id} 
          onReviewSubmitted={handleReviewSubmitted} 
          accessTokenFetcher={getAccessTokenSilently} 
        />
      )}
    </div>
  );
};

export default AddAvis;
