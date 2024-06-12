// CartitemsLocal.js
import React, { useEffect, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartitemsLocal = () => {
  const { cartCount, updateCartCount } = useCart();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Récupérer le panier local depuis le stockage local du navigateur
    const localCartItems = JSON.parse(localStorage.getItem('localCart'));
    if (localCartItems) {
      setCartItems(localCartItems);
    }
  }, []);

  const handleDelete = (id) => {
    // Supprimer l'article du panier local
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('localCart', JSON.stringify(updatedCartItems));
    updateCartCount(cartCount - 1);
  };

  const subTotal = cartItems.reduce((total, item) => total + (item.quantite * item.prixTVA), 0);
  const shippingCost = subTotal >= 100 ? 0 : 10;
  const total = subTotal + shippingCost;

  if (!cartItems || cartItems.length === 0) {
    return <div>Votre panier est vide.</div>;
  }

  return (
    <div>
      <div className='w-11/12 m-auto py-10'>
        <h1 className='text-3xl font-bold'>Mon Panier</h1><br />
        <p className='text-lg text-gray-500'>Vous avez {cartItems.length} articles dans votre panier</p>
        <section className='flex justify-between items-center space-x-10'>
          <div className='w-[60%] space-y-3'>
            <table className='w-full'>
              <thead className='border-b'>
                <tr>
                  <td className='text-gray-40 py-2'>Articles</td>
                  <td className='text-gray-40 py-2'>Prix</td>
                  <td className='text-gray-40 py-2'>Quantité</td>
                  <td className='text-gray-40 py-2'>Total</td>
                  <td className='text-gray-40 py-2'>Supprimer</td>
                </tr>
              </thead>
              <tbody className='space-y-10'>
                {cartItems.map((item, index) => (
                  <tr key={index} className='border-dashed border-b'>
                    <td className='py-5'>
                      <div className='flex items-center space-x-3 py-2'>
                        <div className="flex items-center space-x-2">
                          <img
                            key={index}
                            src={item.images[0].url}
                            alt={`Image ${index}`}
                            className="w-16 h-16 object-cover cursor-pointer border-2 border-gray-200 hover:border-stone-700 focus:outline-none rounded-md"
                          />
                          <h1 className="text-xl font-bold">{item.nom}</h1>
                        </div>
                      </div>
                    </td>
                    <td>{item.prixTVA} €</td>
                    <td>
                      <div className='border w-24 p-2'>
                        <input type="number" className='w-full outline-0' value={item.quantite} readOnly />
                      </div>
                    </td>
                    <td>{item.quantite * item.prixTVA} €</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="button-red"
                      >
                        <AiFillDelete size={"1.7rem"} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='my-5'>
              <NavLink to="/">
                <button className='flex items-center space-x-3 bg-gray-200 font-semibold rounded p-2'>
                  <BsArrowLeft />
                  <span>Continuer les achats</span>
                </button>
              </NavLink>
            </div>
          </div>
          <div className='w-[40%] h-fit border rounded p-5 space-y-5'>
            <div className='flex justify-between items-center border-b border-dashed p-2'>
              <h1 className='text-xl'>Sous Total</h1>
              <p>{subTotal} €</p>
            </div>
            <div className='flex justify-between items-center border-b border-dashed p-2'>
              <h1 className='text-xl'>Livraison</h1>
              <p className={shippingCost === 0 ? 'text-green-500' : ''}>
                {shippingCost === 0 ? 'Gratuite' : `${shippingCost} €`}
              </p>
            </div>
            <div className='flex justify-between items-center p-2'>
              <h1 className='text-xl'>Total</h1>
              <p>{total} €</p>
            </div>
            <button className='w-full p-2 bg-gray-800 text-center text-white rounded'>
              <NavLink to={"/paymentForm"}>Passer la commande</NavLink>
            </button>
          </div>
        </section>
      </div>
    </div>
 
);
};

export default CartitemsLocal;
