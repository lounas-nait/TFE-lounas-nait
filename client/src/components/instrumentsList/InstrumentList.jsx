import React, { useState, useEffect } from 'react';
import { CiShoppingCart } from 'react-icons/ci';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { generateStars } from '../../functions/Etoile';
import stockStatus from '../../functions/StockStatus';

function ProductList({ products, handleClick, favoriteInstruments, isAdmin, handleDelete }) {
  const [localFavoriteInstruments, setLocalFavoriteInstruments] = useState({});
  const [hoveredInstrumentId, setHoveredInstrumentId] = useState(null);

  const toggleFavorite = (instrumentId) => {
    setLocalFavoriteInstruments((prevFavorites) => {
      const isCurrentlyFavorite = prevFavorites[instrumentId];
      return { ...prevFavorites, [instrumentId]: !isCurrentlyFavorite };
    });
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
                {stockStatus(product.quantiteEnStock)}
              </div>
              <p className='text-sm'> {generateStars(product.averageRating)}</p>
              <div className='flex justify-between items-center'>
                <p className='text-xl font-bold'>{product.prixTVA} euro</p>
                <div className='flex items-center space-x-2'>
                  {localFavoriteInstruments[product.id] ? (
                    <BsHeartFill
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      size={'1.2rem'}
                      style={{ color: 'red', cursor: 'pointer' }}
                    />
                  ) : (
                    <BsHeart
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      size={'1.2rem'}
                      style={{
                        cursor: 'pointer',
                        color: hoveredInstrumentId === product.id ? 'red' : 'black'
                      }}
                      onMouseEnter={() => setHoveredInstrumentId(product.id)}
                      onMouseLeave={() => setHoveredInstrumentId(null)}
                    />
                  )}
                  <CiShoppingCart size={'1.4rem'} style={{ cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            {isAdmin && (
              <AiFillDelete
                size={"1.7rem"}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); 
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
