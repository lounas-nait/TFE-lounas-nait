import React, { useState, useEffect } from 'react';
import { CiShoppingCart } from 'react-icons/ci';
import useSWR from 'swr';
import { generateStars } from '../functions/Etoile';
import { calculMoyenne } from '../functions/Noter';
import TopBar from './TopBar';
import { useCart } from './CartContext'; 

function Main() {
  const { cartCount, updateCartCount } = useCart(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentsWithAvgRating, setInstrumentsWithAvgRating] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchInstruments = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des instruments');
    }
    return response.json();
  };

  const searchURL = `/api/instruments?q=${searchQuery}`;

  const { data: instruments, error, isValidating } = useSWR(searchURL, fetchInstruments);

  useEffect(() => {
    if (instruments) {
      const updatedInstruments = calculMoyenne(instruments);
      setInstrumentsWithAvgRating(updatedInstruments);
    }
  }, [instruments]);

  const handleInstrumentClick = (instrument) => {
    setSelectedInstrument(instrument);
    setCurrentImageIndex(0);
    setQuantity(1); 
    setErrorMessage(''); 
  };

  const handleCloseDetails = () => {
    setSelectedInstrument(null);
    setQuantity(1); 
    setErrorMessage(''); 
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (selectedInstrument) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItemIndex = cart.findIndex(item => item.id === selectedInstrument.id);
  
      if (existingItemIndex !== -1) {
        const newTotalQuantity = cart[existingItemIndex].quantity + quantity;
        if (newTotalQuantity <= selectedInstrument.quantiteEnStock) {
          cart[existingItemIndex].quantity = newTotalQuantity;
          setErrorMessage('');
        } else {
          setErrorMessage(`La quantité totale pour ${selectedInstrument.nom} dépasse la quantité en stock.`);
          return;
        }
      } else {
        if (quantity <= selectedInstrument.quantiteEnStock) {
          cart.push({
            id: selectedInstrument.id,
            name: selectedInstrument.nom,
            quantity: quantity,
            price: selectedInstrument.prixTVA
          });
          setErrorMessage('');
          updateCartCount(cartCount + 1); 
        } else {
          setErrorMessage(`La quantité sélectionnée dépasse la quantité en stock de ${selectedInstrument.nom}`);
          return;
        }
      }
  
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Article ajouté au panier:', {
        id: selectedInstrument.id,
        name: selectedInstrument.nom,
        quantity: quantity,
        price: selectedInstrument.prixTVA
      });
    }
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? selectedInstrument.images.length - 1 : prevIndex - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === selectedInstrument.images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className='w-full relative'>
      <TopBar setSearchQuery={setSearchQuery} />
      
      {error ? (
        <div className="mt-4 text-red-500 text-center">Erreur lors de la récupération des instruments: {error.message}</div>
      ) : (
        <>
          {selectedInstrument && (
            <div className="fixed top-0 left-0  w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
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
                <p className="text-gray-700">{generateStars(selectedInstrument.averageRating)}</p>
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
              </div>
            </div>
          )}

          {isImageModalOpen && (
            <div className="fixed top-0 left-0  w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 h-[600px] w-[900px] rounded-md relative">
                <button onClick={handleCloseImageModal} className="absolute top-0 right-0 m-2 p-2 text-gray-600 hover:text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img src={selectedInstrument.images[selectedImageIndex].url} alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          )}

          <div className="products grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-9 p-4 z-20">
            {instrumentsWithAvgRating.map((product, idx) => (
              <div key={idx} onClick={() => handleInstrumentClick(product)} className="cursor-pointer">
                <div className="product h-[300px] bg-white drop-shadow-2xl p-2 border">
                  {product.images.length > 0 && (
                    <img src={product.images[0].url} alt="" className='w-full h-[60%] object-cover p-2' />
                  )}
                  <div className='m-2 bg-gray-100 p-2'>
                    <h1 className='text-xl font-semibold'>{product.nom}</h1>
                    <p className='text-sm'>{product.description}</p>
                    <p className='text-sm'> {generateStars(product.averageRating)}</p>
                    <div className='flex justify-between items-center'>
                      <p className='text-xl font-bold'>{product.prixTVA} euro</p>
                      <CiShoppingCart size={'1.4rem'} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Main;
