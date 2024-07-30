import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AiFillDelete } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import TopBar from '../menu/TopBar';


const fetcher = (url) => fetch(url).then(res => res.json());

const FavoriteItemsLocal = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteInstruments')) || {};
    const favoritesArray = Object.keys(storedFavorites).filter(id => storedFavorites[id]);
    setFavoriteIds(favoritesArray);
  }, []);

  
  const { data: instruments, error } = useSWR('/api/instruments', fetcher);

  
  const favoriteItems = instruments ? instruments.content.filter(item => favoriteIds.includes(item.id)) : [];

  const handleDelete = (id) => {
    
    const updatedFavoriteIds = favoriteIds.filter(favId => favId !== id);
    setFavoriteIds(updatedFavoriteIds);

    const storedFavorites = JSON.parse(localStorage.getItem('favoriteInstruments')) || {};
    storedFavorites[id] = false;
    localStorage.setItem('favoriteInstruments', JSON.stringify(storedFavorites));
  };

  if (error) return <div>Erreur de chargement des instruments...</div>;
  if (!instruments) return <div>Chargement...</div>;

  if (favoriteItems.length === 0) {
    return (
      <div className='w-11/12 m-auto py-10'>
        <TopBar /><br /><br />
        <h1 className='text-3xl font-bold'>Mes Favoris</h1><br />
        <p className='text-lg text-gray-500'>Vous n'avez aucun favori</p>
        <div className='my-5'>
          <NavLink to="/">
            <button className='flex items-center space-x-3 bg-gray-200 font-semibold rounded p-2'>
              <BsArrowLeft />
              <span>Continuer les achats</span>
            </button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className='w-11/12 m-auto py-10'>
      <TopBar /><br /><br /><br /><br />
      <h1 className='text-3xl font-bold'>Mes Favoris</h1><br />
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {favoriteItems.map((item, index) => (
          <div key={index} className='border rounded p-5 flex flex-col justify-between h-64'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-bold'>{item.nom}</h2>
              <button onClick={() => handleDelete(item.id)} className="button-red">
                <AiFillDelete size={"1.7rem"} />
              </button>
            </div>
            {item.images && item.images.length > 0 && (
              <img
                src={item.images[0].url}
                alt={`Image ${index}`}
                className="w-full h-32 object-cover mt-4"
              />
            )}
            <p className='mt-4'>{item.prixTVA} €</p>
          </div>
        ))}
      </section>
      <div className='my-5'>
        <NavLink to="/">
          <button className='flex items-center space-x-3 bg-gray-200 font-semibold rounded p-2'>
            <BsArrowLeft />
            <span>Continuer les achats</span>
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default FavoriteItemsLocal;
