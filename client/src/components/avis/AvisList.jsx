
import React from 'react';
import StarRatings from 'react-star-ratings'; 
import { FaUserCircle } from 'react-icons/fa';

const AvisList = ({ avis }) => {
  // Inverser les avis pour afficher les plus récents en premier
  const reversedAvis = [...avis].reverse();

  return (
    <div className="w-1/2 pr-4">
      <h2 className="text-xl font-semibold mb-4">Avis des clients</h2>
      {reversedAvis.length > 0 ? (
        reversedAvis.map((avis) => (
          <div key={avis.id} className="mb-4 p-4 border border-gray-300 rounded-md">
            <div className="flex items-center mb-2">
              <FaUserCircle className="mr-2" size="1.7em" /> 
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
  );
};

export default AvisList;
