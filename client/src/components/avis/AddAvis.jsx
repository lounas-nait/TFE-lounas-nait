
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { mutate } from 'swr';
import AvisList from './AvisList';
import AddAvisForm from './AddAvisForm';

const AddAvis = () => {
  const { id } = useParams();  // id de l'instrument
  const { getAccessTokenSilently } = useAuth0();

  const fetcher = async (url) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
  const { data: instrumentsData, error: instrumentsError } = useSWR('/api/instruments', fetchInstrument);

  if (clientError) {
    return <div className="text-red-500">Erreur lors de la récupération des données du client.</div>;
  }

  if (!clientData || !instrumentsData) {
    return <div>Chargement...</div>;
  }

  const instrument = instrumentsData.find((instrument) => instrument.id === id);

  if (!instrument) {
    return <div className="text-red-500">Instrument non trouvé.</div>;
  }

  const handleReviewSubmitted = () => {
    mutate('/api/instruments');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 flex">
      <AvisList avis={instrument.avis} />
      <AddAvisForm 
        clientId={clientData.id} 
        instrumentId={id} 
        onReviewSubmitted={handleReviewSubmitted} 
        accessTokenFetcher={getAccessTokenSilently} 
      />
    </div>
  );
};

export default AddAvis;
