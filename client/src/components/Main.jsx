import React, { useState, useEffect } from 'react';
import { CiShoppingCart } from 'react-icons/ci';
import useSWR, { mutate } from 'swr';
import { generateStars } from '../functions/Etoile';
import { calculMoyenne } from '../functions/Noter';
import TopBar from './menu/TopBar';
import { useCart } from './context/CartContext';
import { useAuth0 } from "@auth0/auth0-react";
import Categories from './instrumentsList/Categories';
import addToCart from '../functions/AddToCart';
import handleUpdate from '../functions/HandleUpdate';
import ImageModal from './instrumentsList/ImageModal';
import InstrumentDetail from './instrumentsList/InstrumentDetail';
import ProductList from './instrumentsList/InstrumentList';

function Main() {
  const { cartCount, updateCartCount } = useCart();
  const { getAccessTokenSilently, user, isAuthenticated, isLoading } = useAuth0();
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentsWithAvgRating, setInstrumentsWithAvgRating] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [updatedQuantiteEnStock, setUpdatedQuantiteEnStock] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [favoriteInstruments, setFavoriteInstruments] = useState({});

  const toggleFavorite = (instrumentId) => {
    setFavoriteInstruments((prevFavorites) => {
      const isCurrentlyFavorite = prevFavorites[instrumentId];
      return { ...prevFavorites, [instrumentId]: !isCurrentlyFavorite };
    });
  };

  const fetcher = async (url) => {
    const accessToken = await getAccessTokenSilently();
    return fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((r) => r.json());
  };

  const { data: cartItemsData, error: cartError } = useSWR(`/api/paniers`, fetcher);

  const fetchInstruments = async (url) => {
    let requestURL = url;
    

    return fetch(requestURL, {
      headers: {
        Accept: 'application/json',
      },
    }).then((r) => r.json());
  };


  const searchURL = `/api/instruments?q=${searchQuery}${selectedCategory ? `&categorie=${selectedCategory}` : ''}`;


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
    setUpdatedQuantiteEnStock(instrument.quantiteEnStock); // Initialiser avec la quantité actuelle
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

  const handleUpdatedQuantityChange = (e) => {
    setUpdatedQuantiteEnStock(parseInt(e.target.value, 10));
  };

  const handleUpdateInstrument = async () => {
    handleUpdate(selectedInstrument, updatedQuantiteEnStock, getAccessTokenSilently, searchURL, setSelectedInstrument, setErrorMessage);
  };

  const handleAddToCart = async () => {
    addToCart(selectedInstrument, cartItemsData, cartCount, updateCartCount, quantity, getAccessTokenSilently, setErrorMessage);
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const isAdmin = isAuthenticated && user.email.startsWith('admin');

  return (
    <div className='w-full relative'>
      <div >
        <TopBar setSearchQuery={setSearchQuery} />
      </div>
      <div>
        <br /><br /><br />
        <Categories setSelectedCategory={setSelectedCategory} />
      </div>
      {error ? (
        <div className="mt-4 text-red-500 text-center">Erreur lors de la récupération des instruments: {error.message}</div>
      ) : (
        <>
          {selectedInstrument && (
            <InstrumentDetail
            handleCloseDetails={handleCloseDetails}
            selectedInstrument={selectedInstrument}
            currentImageIndex={currentImageIndex}
            handleImageClick={handleImageClick}
            selectedImageIndex={selectedImageIndex}
            isImageModalOpen={isImageModalOpen}
            handleCloseImageModal={handleCloseImageModal}
            handleQuantityChange={handleQuantityChange}
            handleUpdatedQuantityChange={handleUpdatedQuantityChange}
            handleUpdateInstrument={handleUpdateInstrument}
            handleAddToCart={handleAddToCart}
            isAdmin={isAdmin}
            quantity={quantity}
            updatedQuantiteEnStock={updatedQuantiteEnStock}
            errorMessage={errorMessage}
          />
          )}

          {isImageModalOpen && (
            <ImageModal
            handleCloseImageModal={handleCloseImageModal}
            selectedInstrument={selectedInstrument}
            selectedImageIndex={selectedImageIndex}
          />
          )}

          <div className="products grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-9 p-4 z-20">
          <ProductList
              products={instrumentsWithAvgRating}
              handleClick={handleInstrumentClick}
              favoriteInstruments={favoriteInstruments}
            />
          </div>
        </>
      )}
    </div>

  );
}

export default Main;
