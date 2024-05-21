import React, { useState, useEffect } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { useCart } from './CartContext';

const Cartitems = () => {
  const { cartCount, updateCartCount } = useCart();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCartItems);
  }, []);

  const subTotal = cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  const shippingCost = subTotal >= 100 ? 0 : 10;
  const total = subTotal + shippingCost;

  const handleDelete = (indexToRemove) => {
    const updatedCartItems = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    updateCartCount(updatedCartItems.length);
  };

  return (
    <div>
      <div className='w-11/12 m-auto py-10'>
        <h1 className='text-3xl font-bold'>Mon Panier</h1><br/>
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
                        <div>
                          <h1 className='text-xl font-bold'>{item.name}</h1>
                        </div>
                      </div>
                    </td>
                    <td>{item.price} €</td>
                    <td>
                      <div className='border w-24 p-2'>
                        <input type="number" className='w-full outline-0' value={item.quantity} readOnly />
                      </div>
                    </td>
                    <td>{item.quantity * item.price} €</td>
                    <td>
                      <button
                        onClick={() => handleDelete(index)}
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
              Passer la commande
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cartitems;
