import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { mutate } from 'swr';
import StarRatings from 'react-star-ratings'; 
import { FaUserCircle } from 'react-icons/fa';

const AddAvis = () => {
  const { id } = useParams();  // id de l'instrument
  const { getAccessTokenSilently } = useAuth0();
  const [note, setNote] = useState(0);
  const [commentaire, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const { data: clientData, error: clientError } = useSWR('/api/paniers', fetcher);
  const { data: instrumentsData, error: instrumentsError } = useSWR('/api/instruments', fetchInstrument);

  const handleNoteChange = (newRating) => {
    setNote(parseFloat(newRating));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/api/aviss/${clientData.client.id}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          note,
          commentaire
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      setSuccessMessage('Avis publié avec succès');
      setErrorMessage('');

      // Mettre à jour les avis en utilisant SWR mutate pour recharger les données
      mutate('/api/instruments');

      // Optionally clear the form
      setNote(0);
      setComment('');
      
    } catch (error) {
      setErrorMessage('Erreur lors de la publication de l\'avis');
      setSuccessMessage('');
    }
  };

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

  // Inverser les avis pour afficher les plus récents en premier
  const reversedAvis = [...instrument.avis].reverse();

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 flex">
      <div className="w-1/2 pr-4">
        <h2 className="text-xl font-semibold mb-4">Avis des clients</h2>
        {reversedAvis.length > 0 ? (
          reversedAvis.map((avis) => (
            <div key={avis.id} className="mb-4 p-4 border border-gray-300 rounded-md">
              <div className="flex items-center mb-2">
                <FaUserCircle className="mr-2" size="1.7em" /> {/* Icône de profil */}
                <p className="text-sm font-semibold">{avis.client.nom}</p>
              </div>
              <div className="flex items-center mb-2">
                <StarRatings
                  rating={avis.note}
                  starRatedColor="gold"
                  numberOfStars={5}
                  name='rating'
                  starDimension="17px"
                  starSpacing="2px"
                />
              </div>
              <p className="text-sm">{avis.commentaire}</p>
            </div>
          ))
        ) : (
          <div>Aucun avis pour cet instrument.</div>
        )}
      </div>
      <div className="w-1/2 pl-4">
        <h1 className="text-2xl font-semibold mb-4">Ajouter un avis</h1>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="note" className="block text-gray-700">Note:</label>
            <StarRatings
              rating={note}
              changeRating={handleNoteChange}
              numberOfStars={5}
              name='rating'
              starDimension="20px"
              starSpacing="2px"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="commentaire" className="block text-gray-700">Commentaire:</label>
            <textarea id="commentaire" value={commentaire} onChange={handleCommentChange} className="w-full border border-gray-300 rounded-md px-2 py-1"></textarea>
          </div>
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Soumettre</button>
        </form>
      </div>
    </div>
  );
};

export default AddAvis;
