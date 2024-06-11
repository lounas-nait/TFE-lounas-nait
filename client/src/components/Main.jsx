import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { useAuth0 } from "@auth0/auth0-react";
import TopBar from './menu/TopBar';
import Categories from './instrumentsList/Categories';
import ImageModal from './instrumentsList/ImageModal';
import InstrumentDetail from './instrumentsList/InstrumentDetail';
import ProductList from './instrumentsList/InstrumentList';
import addToCart from '../functions/AddToCart';
import handleUpdate from '../functions/HandleUpdate';
import { useCart } from './context/CartContext';
import { calculMoyenne } from '../functions/Noter';

function Main() {
  const { cartCount, updateCartCount } = useCart();
  const { getAccessTokenSilently, user, isAuthenticated, isLoading } = useAuth0();
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentsWithAvgRating, setInstrumentsWithAvgRating] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantite, setQuantite] = useState(1);
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

  const fetchCartItemCount = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const cartResponse = await fetch(`/api/paniers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const cartItemsData = await cartResponse.json();
      const itemCount = cartItemsData?.lignesPanier?.length || 0;
      updateCartCount(itemCount);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier', error);
    }
  };

  useEffect(() => {
    // Récupérer le nombre d'articles dans le panier lors du chargement initial
    if (isAuthenticated) {
      fetchCartItemCount();
    }
  }, [isAuthenticated]); // Exécuter cette action lorsque l'utilisateur est authentifié

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
    setQuantite(1);
    setUpdatedQuantiteEnStock(instrument.quantiteEnStock);
    setErrorMessage('');
  };

  const handleCloseDetails = () => {
    setSelectedInstrument(null);
    setQuantite(1);
    setErrorMessage('');
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleQuantiteChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantite(value);
  };

  const handleUpdatedQuantiteChange = (e) => {
    setUpdatedQuantiteEnStock(parseInt(e.target.value, 10));
  };

  const handleUpdateInstrument = async () => {
    handleUpdate(selectedInstrument, updatedQuantiteEnStock, getAccessTokenSilently, searchURL, setSelectedInstrument, setErrorMessage);
  };

  const handleAddToCart = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const cartResponse = await fetch(`/api/paniers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const cartItemsData = await cartResponse.json();
  
      // Appeler la fonction addToCart avec les données du panier récupérées
      addToCart(selectedInstrument, cartItemsData, cartCount, updateCartCount, quantite, getAccessTokenSilently, setErrorMessage);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier', error);
      console.log(cartCount)
      
    }
  };
  

  const handleDeleteInstrument = async (id) => {
    const accessToken = await getAccessTokenSilently();
    try {
      await fetch(`/api/instruments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      mutate(searchURL);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'instrument', error);
    }
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
              handleQuantiteChange={handleQuantiteChange}
              handleUpdatedQuantiteChange={handleUpdatedQuantiteChange}
              handleUpdateInstrument={handleUpdateInstrument}
              handleAddToCart={handleAddToCart}
              isAdmin={isAdmin}
              quantite={quantite}
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
              isAdmin={isAdmin}
              handleDelete={handleDeleteInstrument}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Main;
