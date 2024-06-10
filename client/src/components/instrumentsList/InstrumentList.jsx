import React, { useState } from 'react';
import { CiShoppingCart } from 'react-icons/ci';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { generateStars } from '../../functions/Etoile';

function ProductList({ products, handleClick, favoriteInstruments, isAdmin, handleDelete }) {
  const [localFavoriteInstruments, setLocalFavoriteInstruments] = useState({});

  const toggleFavorite = (instrumentId) => {
    setLocalFavoriteInstruments((prevFavorites) => {
      const isCurrentlyFavorite = prevFavorites[instrumentId];
      return { ...prevFavorites, [instrumentId]: !isCurrentlyFavorite };
    });
  };

  const getStockStatus = (quantity) => {
    if (quantity > 3) {
      return <span className="text-green-500">En stock</span>;
    } else if (quantity > 0) {
      return <span className="text-orange-500">Plus que {quantity} en stock</span>;
    } else {
      return <span className="text-red-500">En rupture de stock</span>;
    }
  };

  return (
    <>
      {products.map((product, idx) => (
        <div key={idx} onClick={() => handleClick(product)} className="relative cursor-pointer">
          <div className="product h-[300px] bg-white drop-shadow-2xl p-2 border">
            {product.images.length > 0 && (
              <img src={product.images[0].url} alt="" className='w-full h-[60%] object-cover p-2' />
            )}
            <div className='m-2 bg-gray-100 p-2'>
              <h1 className='text-xl font-semibold'>{product.nom}</h1>
              <div className='text-sm'>
              {getStockStatus(product.quantiteEnStock)}
            </div>
              <p className='text-sm'> {generateStars(product.averageRating)}</p>
              <div className='flex justify-between items-center'>
                <p className='text-xl font-bold'>{product.prixTVA} euro</p>
                {favoriteInstruments[product.id] ? (
                  <BsHeartFill onClick={() => toggleFavorite(product.id)} size={'1.4rem'} style={{ color: 'red', cursor: 'pointer' }} />
                ) : (
                  <BsHeart onClick={() => toggleFavorite(product.id)} size={'1.4rem'} style={{ cursor: 'pointer' }} />
                )}
                <CiShoppingCart size={'1.4rem'} />
              </div>
            </div>
            
            {isAdmin && (
              <AiFillDelete
                size={"1.7rem"}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleClick
                  handleDelete(product.id);
                }}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductList;

