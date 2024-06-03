
import React, {useState} from 'react';
import { CiShoppingCart } from 'react-icons/ci';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { generateStars } from '../../functions/Etoile';


function ProductList({ products, handleClick, favoriteInstruments }) {

  const [localFavoriteInstruments, setLocalFavoriteInstruments] = useState({});

  const toggleFavorite = (instrumentId) => {
    setLocalFavoriteInstruments((prevFavorites) => {
      const isCurrentlyFavorite = prevFavorites[instrumentId];
      return { ...prevFavorites, [instrumentId]: !isCurrentlyFavorite };
    });
  };
  
  return (
    <>
      {products.map((product, idx) => (
        <div key={idx} onClick={() => handleClick(product)} className="cursor-pointer">
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
                {favoriteInstruments[product.id] ? (
                  <BsHeartFill onClick={() => toggleFavorite(product.id)} size={'1.4rem'} style={{ color: 'red', cursor: 'pointer' }} />
                ) : (
                  <BsHeart onClick={() => toggleFavorite(product.id)} size={'1.4rem'} style={{ cursor: 'pointer' }} />
                )}
                <CiShoppingCart size={'1.4rem'} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductList;
