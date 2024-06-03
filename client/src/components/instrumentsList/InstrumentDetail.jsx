import React, { useState } from 'react';
import { generateStars } from '../../functions/Etoile'; 
import { Link } from 'react-router-dom';

const InstrumentDetail = ({ handleCloseDetails, selectedInstrument, handleImageClick, isAdmin, handleUpdatedQuantityChange, handleUpdateInstrument, handleQuantityChange, handleAddToCart, quantity, updatedQuantiteEnStock, errorMessage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? selectedInstrument.images.length - 1 : prevIndex - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === selectedInstrument.images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 h-[600px] w-[900px] rounded-md relative">
        <button onClick={handleCloseDetails} className="absolute top-0 right-0 m-2 p-2 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-3xl font-semibold mb-4">{selectedInstrument.nom}</h1>
        <div className="relative">
          <button onClick={goToPreviousImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img src={selectedInstrument.images[currentImageIndex].url} alt="" onClick={() => handleImageClick(currentImageIndex)} className="w-full h-64 object-cover mb-4 cursor-pointer" />
          <button onClick={goToNextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          {selectedInstrument.images.map((image, index) => (
            <img key={index} src={image.url} alt={`Image ${index}`} onClick={() => handleImageClick(index)} className="w-12 h-12 object-cover cursor-pointer border-2 border-gray-400 hover:border-stone-700 focus:outline-none rounded-md" />
          ))}
        </div>
        <p className="text-gray-700">{selectedInstrument.description}</p>
        <div className="flex items-center">
          <p className="text-gray-700">{generateStars(selectedInstrument.averageRating)}  </p>
          <p className='ml-2'>({selectedInstrument.avis.length})</p>
          <Link to={`/add-review/${selectedInstrument.id}`} className="text-blue-500 underline ml-2"> voir les avis</Link> 
        </div>
        
        {isAdmin ? (
          <>
            <p className="text-gray-700">Quantité en stock: {selectedInstrument.quantiteEnStock}</p>
            <div className="flex items-center mt-4">
              <label htmlFor="updatedQuantity" className="mr-2">Nouvelle quantité:</label>
              <input type="number" id="updatedQuantity" name="updatedQuantity" min="0" value={updatedQuantiteEnStock} onChange={handleUpdatedQuantityChange} className="border border-gray-300 rounded-md px-2 py-1" />
              <button onClick={handleUpdateInstrument} className="ml-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Update</button>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <label htmlFor="quantity" className="mr-2">Quantité:</label>
              <input type="number" id="quantity" name="quantity" min="1" max={selectedInstrument.quantiteEnStock} value={quantity} onChange={handleQuantityChange} className="border border-gray-300 rounded-md px-2 py-1" />
            </div>
            <button onClick={handleAddToCart} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Ajouter au panier</button>
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
