import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiShoppingCart } from 'react-icons/ci';
import useSWR from 'swr';
import SearchBar from './SearchBar';
import { generateStars } from '../functions/Etoile';
import { calculMoyenne } from '../functions/Noter';
import { Disclosure } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Catégories', href: '#', current: true },
  { name: 'Occasion', href: '#', current: false },
];

function Main() {
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentsWithAvgRating, setInstrumentsWithAvgRating] = useState([]);

  const fetchInstruments = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des instruments');
    }
    return response.json();
  };

  const { data: instruments, error, isValidating } = useSWR(`/api/instruments?q=${searchQuery}`, fetchInstruments);

  useEffect(() => {
    if (instruments) {
      const updatedInstruments = calculMoyenne(instruments);
      setInstrumentsWithAvgRating(updatedInstruments);
    }
  }, [instruments]);

  if (error) {
    return <div>Erreur lors de la récupération des instruments: {error.message}</div>;
  }

  if (!instruments || isValidating) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className='w-full relative'>
      <Disclosure as="nav" className="bg-gradient-to-r from-amber-700 from-5% via-stone-500 via-60% to-gray-800 to-80% ...">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <SearchBar onSearch={setSearchQuery} />
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ml-2"
                  >
                    <span className="absolute -inset-2" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      <div className="products grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-9 p-4 z-20">
        {instrumentsWithAvgRating.map((product, idx) => (
          <Link key={idx} to={`/instrument/${product.id}`} target="_blank">
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Main;
