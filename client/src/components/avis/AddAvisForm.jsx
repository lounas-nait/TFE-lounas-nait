import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import StarRatings from 'react-star-ratings';
import LoginButton from '../../authentification/LoginButton';

const AddAvisForm = ({ clientId, instrumentId, onReviewSubmitted, accessTokenFetcher }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [note, setNote] = useState(0);
  const [commentaire, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleNoteChange = (newRating) => {
    setNote(parseFloat(newRating));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = await accessTokenFetcher();
      const response = await fetch(`/api/aviss/${clientId}/${instrumentId}`, {
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
      onReviewSubmitted();

      // reset form
      setNote(0);
      setComment('');

    } catch (error) {
      setErrorMessage('Erreur lors de la publication de l\'avis');
      setSuccessMessage('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-1/2 pl-4">
        <h1 className="text-2xl font-semibold mb-4">Ajouter un avis</h1>
        <p className="mr-2 mt-8 mb-8">Connectez-vous pour laisser un avis</p>
         <LoginButton className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"/>
      </div>
    );
  }

  return (
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
  );
};

export default AddAvisForm;
