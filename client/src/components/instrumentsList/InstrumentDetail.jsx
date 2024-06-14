import React, { useState } from 'react';
import { generateStars } from '../../functions/Etoile';
import { Link } from 'react-router-dom';
import stockStatus from '../../functions/StockStatus';

const InstrumentDetail = ({
  handleCloseDetails,
  selectedInstrument,
  handleImageClick,
  isAdmin,
  handleUpdatedQuantiteChange,
  handleUpdateInstrument,
  handleQuantiteChange,
  handleAddToCart,
  quantite,
  updatedQuantiteEnStock,
  errorMessage,
  isAuthenticated,
  handleAddToLocalCart,
  handleUpdatedPriceChange, 
  updatedPrixTVA,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedInstrument.images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedInstrument.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 h-[600px] w-[900px] rounded-md relative">
        <button
          onClick={handleCloseDetails}
          className="absolute top-0 right-0 m-2 p-2 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-semibold mb-4">
          {selectedInstrument.nom} ({selectedInstrument.marque})
        </h1>
        <div className="relative">
          <button
            onClick={goToPreviousImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <img
            src={selectedInstrument.images[currentImageIndex].url}
            alt=""
            onClick={() => handleImageClick(currentImageIndex)}
            className="w-full h-64 object-cover mb-4 cursor-pointer"
          />
          <button
            onClick={goToNextImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          {selectedInstrument.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Image ${index}`}
              onClick={() => handleImageClick(index)}
              className="w-12 h-12 object-cover cursor-pointer border-2 border-gray-400 hover:border-stone-700 focus:outline-none rounded-md"
            />
          ))}
        </div>
        <p className="text-gray-700">{selectedInstrument.description}</p>
        <div className="flex items-center mt-2">
          <p className="text-gray-700">
            {generateStars(selectedInstrument.averageRating)}
          </p>
          <p className="ml-2">({selectedInstrument.avis.length})</p>
          <Link
            to={`/add-review/${selectedInstrument.id}`}
            className="text-blue-500 underline ml-2"
          >
            Voir les avis
          </Link>
        </div>
        <p className="text-xl font-bold">{selectedInstrument.prixTVA} euro</p>
        <div className="text-sm">{stockStatus(selectedInstrument.quantiteEnStock)}</div>
        <div className="flex items-center ">
          
          {isAdmin && (
            <div className="ml-4 flex">
              <div className="mr-4">
                <label
                  htmlFor="updatedPriceTVA"
                  className="block text-gray-700"
                >
                  Nouveau prix (TVA):
                </label>
                <input
                  type="number"
                  id="updatedPriceTVA"
                  name="updatedPriceTVA"
                  min="0"
                  value={updatedPrixTVA}
                  onChange={handleUpdatedPriceChange}
                  className="border border-gray-300 rounded-md px-2 py-1"
                />
              </div>
              <div>
                <label
                  htmlFor="updatedQuantity"
                  className="block text-gray-700"
                >
                  Nouvelle quantité:
                </label>
                <input
                  type="number"
                  id="updatedQuantity"
                  name="updatedQuantity"
                  min="0"
                  value={updatedQuantiteEnStock}
                  onChange={handleUpdatedQuantiteChange}
                  className="border border-gray-300 rounded-md px-2 py-1"
                />
              </div>
              <button
                onClick={handleUpdateInstrument}
                className="ml-4 mt-5 bg-gray-800 text-white px-4 h-10 rounded-md hover:bg-gray-700"
              >
                Mettre à jour
              </button>
            </div>
          )}
        </div>
        
        {!isAdmin && (
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <label htmlFor="quantite" className="mr-2">
                Quantité:
              </label>
              <input
                type="number"
                id="quantite"
                name="quantite"
                min="1"
                max={selectedInstrument.quantiteEnStock}
                value={quantite}
                onChange={handleQuantiteChange}
                className="border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleAddToCart}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Ajouter au panier
              </button>
            ) : (
              <button
                onClick={handleAddToLocalCart}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Ajouter au panier
              </button>
            )}
            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentDetail;
