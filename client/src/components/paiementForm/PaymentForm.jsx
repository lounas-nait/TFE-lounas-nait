import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useAuth0 } from "@auth0/auth0-react";
import { useCart } from '../context/CartContext';
import handlePayment from './handlePayment';
import { NavLink } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaymentForm = () => {
  const { getAccessTokenSilently } = useAuth0();
  const today = new Date().toISOString().substr(0, 10);
  const fetcher = async (url) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }

    return response.json();
  };

  const { data: dataClient, errorClient } = useSWR('/api/clients', fetcher);
  const { data: dataPanier, errorPanier } = useSWR('/api/paniers', fetcher);
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationMonth: '01',
    expirationYear: '2024',
    securityCode: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Visa');
  const [paymentError, setPaymentError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { cartCount, updateCartCount } = useCart();

  if (errorPanier) return <div>Failed to load cart items.</div>;
  if (!dataClient) return <div>Loading...</div>;

  const cartItems = dataPanier.lignesPanier;
  const clientId = dataClient.id;

  const subTotal = cartItems.reduce((total, item) => total + (item.quantite * item.instrument.prixTVA), 0);
  const shippingCost = subTotal >= 100 ? 0 : 10;
  const shippingCostFinal = shippingCost === 0 ? (
    <span className="text-green-500">Gratuite</span>
  ) : (
    `${shippingCost} €`
  );
  const total = subTotal + shippingCost;

  const validatePaymentDetails = () => {
    if (selectedPaymentMethod === 'Visa') {
      const cardNumberRegex = /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/;
      const cvvRegex = /^[0-9]{3}$/;
      const nameOnCardRegex = /^[a-zA-Z\s]*$/;

      if (!nameOnCardRegex.test(cardDetails.nameOnCard.trim())) {
        setPaymentError('Veuillez entrer un nom sur la carte valide.');
        return false;
      }

      if (!cardNumberRegex.test(cardDetails.cardNumber.trim())) {
        setPaymentError('Veuillez entrer un numéro de carte valide (format: 0000 0000 0000 0000).');
        return false;
      }

      if (!cvvRegex.test(cardDetails.securityCode.trim())) {
        setPaymentError('Veuillez entrer un code de sécurité (CVV) valide (3 chiffres).');
        return false;
      }
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePaymentSuccess = async () => {
    await mutate('/api/paniers');
    setShowSuccessModal(true);
  };

  const handlePayPalApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      if (order.status === 'COMPLETED') {
        const paymentSuccess = await handlePayment(
          'PayPal', // Utiliser 'PayPal' comme méthode de paiement
          null,
          validatePaymentDetails,
          clientId,
          cartItems,
          total,
          today,
          getAccessTokenSilently,
          updateCartCount,
          setPaymentError,
          setCardDetails,
          handlePaymentSuccess
        );

        if (paymentSuccess) {
          handlePaymentSuccess();
        }
      }
    } catch (error) {
      console.error('Error during PayPal payment approval:', error);
      setPaymentError('Failed to process PayPal payment.');
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 py-5 ml-[80px]">
      <div className="px-5">
        <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
          <div className="w-full">
            <div className="-mx-3 md:flex items-start">
              <div className="px-3 md:w-7/12 lg:pr-10">
                {cartItems.length === 0 ? (
                  <div className='my-5'>
                    <NavLink to="/">
                      <button className='flex items-center space-x-3 bg-gray-200 font-semibold rounded p-2'>
                        <BsArrowLeft />
                        <span>Continuer les achats</span>
                      </button>
                    </NavLink>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item, index) => (
                      <div key={index} className="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6">
                        <div className="w-full flex items-center">
                          <div className="overflow-hidden rounded-lg w-16 h-16 bg-gray-50 border border-gray-200">
                            <img src={item.instrument.images[0].url} alt={item.instrument.images[0].url} />
                          </div>
                          <div className="flex-grow pl-3">
                            <h6 className="font-semibold uppercase text-gray-600">{item.instrument.nom}</h6>
                            <p className="text-gray-400">x {item.quantite}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-600 text-xl">{item.instrument.prixTVA * item.quantite} € </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mb-6 pb-6 border-b border-gray-200 text-gray-800">
                      <div className="w-full flex mb-3 items-center">
                        <div className="flex-grow">
                          <span className="text-gray-600">Subtotal</span>
                        </div>
                        <div className="pl-3">
                          <span className="font-semibold">{subTotal} €</span>
                        </div>
                      </div>
                      <div className="w-full flex items-center">
                        <div className="flex-grow">
                          <span className="text-gray-600">Livraison</span>
                        </div>
                        <div className="pl-3">
                          <span className="font-semibold">{shippingCostFinal} </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
                      <div className="w-full flex items-center">
                        <div className="flex-grow">
                          <span className="text-gray-600">Total</span>
                        </div>
                        <div className="pl-3">
                          <span className="font-semibold">{total} €</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="px-3 md:w-5/12">
                {cartItems.length > 0 && (
                  <>
                    <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
                      <div className="w-full flex mb-3 items-center">
                        <div className="w-32">
                          <span className="text-gray-600 font-semibold">Contact</span>
                        </div>
                        <div className="flex-grow pl-3">
                          <span>Music SHOP</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
                      <div className="w-full p-3 border-b border-gray-200">
                        <div className="mb-5">
                          <label htmlFor="visa" className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              className="form-radio h-5 w-5 text-indigo-500"
                              name="paymentMethod"
                              id="visa"
                              value="Visa"
                              checked={selectedPaymentMethod === 'Visa'}
                              onChange={() => setSelectedPaymentMethod('Visa')}
                            />
                            <img src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png" className="h-6 ml-3" />
                          </label>
                          <label htmlFor="paypal" className="flex items-center cursor-pointer mt-3">
                            <input
                              type="radio"
                              className="form-radio h-5 w-5 text-indigo-500"
                              name="type"
                              id="type2"
                              value="PayPal"
                              checked={selectedPaymentMethod === 'PayPal'}
                              onChange={() => setSelectedPaymentMethod('PayPal')}
                            />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6 ml-3" />
                          </label>
                        </div>
                        {selectedPaymentMethod === 'Visa' && (
                          <div id="visaForm">
                            <div className="mb-3">
                              <label htmlFor="nameOnCard" className="text-sm font-semibold text-gray-600">
                                Nom sur la carte
                              </label>
                              <input
                                type="text"
                                name="nameOnCard"
                                id="nameOnCard"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                placeholder="Nom sur la carte"
                                value={cardDetails.nameOnCard}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="mb-3">
                              <label htmlFor="cardNumber" className="text-sm font-semibold text-gray-600">
                                Numéro de la carte
                              </label>
                              <input
                                type="text"
                                name="cardNumber"
                                id="cardNumber"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                placeholder="0000 0000 0000 0000"
                                value={cardDetails.cardNumber}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="mb-3 -mx-2 flex items-end">
                              <div className="px-2 w-1/2">
                                <label htmlFor="expirationMonth" className="text-sm font-semibold text-gray-600">
                                  Mois d'expiration
                                </label>
                                <select
                                  name="expirationMonth"
                                  id="expirationMonth"
                                  className="form-select w-full p-2 border border-gray-300 rounded mt-1"
                                  value={cardDetails.expirationMonth}
                                  onChange={handleInputChange}
                                >
                                  <option value="01">01</option>
                                  <option value="02">02</option>
                                  <option value="03">03</option>
                                  <option value="04">04</option>
                                  <option value="05">05</option>
                                  <option value="06">06</option>
                                  <option value="07">07</option>
                                  <option value="08">08</option>
                                  <option value="09">09</option>
                                  <option value="10">10</option>
                                  <option value="11">11</option>
                                  <option value="12">12</option>
                                </select>
                              </div>
                              <div className="px-2 w-1/2">
                                <label htmlFor="expirationYear" className="text-sm font-semibold text-gray-600">
                                  Année d'expiration
                                </label>
                                <select
                                  name="expirationYear"
                                  id="expirationYear"
                                  className="form-select w-full p-2 border border-gray-300 rounded mt-1"
                                  value={cardDetails.expirationYear}
                                  onChange={handleInputChange}
                                >
                                  <option value="2024">2024</option>
                                  <option value="2025">2025</option>
                                  <option value="2026">2026</option>
                                  <option value="2027">2027</option>
                                  <option value="2028">2028</option>
                                </select>
                              </div>
                            </div>
                            <div className="mb-3">
                              <label htmlFor="securityCode" className="text-sm font-semibold text-gray-600">
                                Code de sécurité
                              </label>
                              <input
                                type="text"
                                name="securityCode"
                                id="securityCode"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                placeholder="000"
                                value={cardDetails.securityCode}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        )}
                        {selectedPaymentMethod === 'PayPal' && (
                          <div className="flex justify-center">
                            <PayPalScriptProvider
                              options={{ 'client-id': 'AVQUWKVgq48z1YnuYsCgeVF0ZBa-NjUhf4Jxp9CVqqs4ygO6yxAKF3YI6jg-Fh-6pdetdTMZeVGm0hhn&currency=EUR' }}
                            >
                              <PayPalButtons
                                style={{ layout: 'horizontal' }}
                                createOrder={(data, actions) => {
                                  return actions.order.create({
                                    purchase_units: [
                                      {
                                        amount: {
                                          value: total.toFixed(2),
                                        },
                                      },
                                    ],
                                  });
                                }}
                                onApprove={(data, actions) => handlePayPalApprove(data, actions)}
                                onError={(err) => {
                                  console.error('PayPal error:', err);
                                  setPaymentError('Failed to initialize PayPal payment.');
                                }}
                                onCancel={() => {
                                  console.log('PayPal payment cancelled.');
                                }}
                              />
                            </PayPalScriptProvider>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={async () => {
                          try {
                            const success = await handlePayment(
                              selectedPaymentMethod,
                              cardDetails,
                              validatePaymentDetails,
                              clientId,
                              cartItems,
                              total,
                              today,
                              getAccessTokenSilently,
                              updateCartCount,
                              setPaymentError,
                              setCardDetails,
                              handlePaymentSuccess
                            );
                            if (success) {
                              handlePaymentSuccess();
                            }
                          } catch (error) {
                            setPaymentError("Une erreur s'est produite. Veuillez réessayer.");
                          }
                        }}
                        className="block w-full max-w-xs mx-auto bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 text-white rounded-lg px-3 py-3 font-semibold"
                        style={{ display: selectedPaymentMethod === 'PayPal' ? 'none' : 'block' }}
                      >
                        Payer avec Visa
                      </button>
                      {paymentError && <p className="text-red-500 mt-3">{paymentError}</p>}
                    </div>

                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Commande passée avec succès!</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Votre commande a été passée avec succès. Vous recevrez bientôt une confirmation par e-mail.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  type="button"
                  className="hidden sm:block absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <NavLink to={"/orders"}>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover focus sm"
                  >
                    Consulter les commandes
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;