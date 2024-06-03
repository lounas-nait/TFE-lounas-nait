import React, { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useAuth0 } from "@auth0/auth0-react";
import { useCart } from '../context/CartContext'; 

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

  const { data: dataClient, errorCLient } = useSWR('/api/clients', fetcher);
  const { data: dataPanier, errorPanier } = useSWR('/api/paniers', fetcher);
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationMonth: '01',
    expirationYear: '2024',
    securityCode: ''
  });

  
  const [paymentError, setPaymentError] = useState(null); // Nouvel état pour gérer les erreurs de paiement

  const { cartCount, updateCartCount } = useCart(); // Utilisation du hook useCart pour obtenir et mettre à jour le compteur de panier

  if (errorPanier) return <div>Failed to load cart items.</div>;
  if (!dataClient) return <div>Loading...</div>;

  const cartItems = dataPanier.lignesPanier;
  const clientId = dataClient.id;
  
  
  console.log(clientId)
  const subTotal = cartItems.reduce((total, item) => total + (item.quantite * item.instrument.prixTVA), 0);
  const shippingCost = subTotal >= 100 ? 0 : 10;
  const shippingCostFinal = shippingCost === 0 ? 'Gratuite' : `${shippingCost} € `;
  const total = subTotal + shippingCost;

  const validatePaymentDetails = () => {
    if (
      cardDetails.nameOnCard.trim() === '' ||
      cardDetails.cardNumber.trim() === '' ||
      cardDetails.expirationMonth.trim() === '' ||
      cardDetails.expirationYear.trim() === '' ||
      cardDetails.securityCode.trim() === ''
    ) {
      setPaymentError('Veuillez remplir tous les champs de paiement.');
      return false;
    }

    // Autres validations peuvent être ajoutées ici

    return true;
  };

  const handlePayment = async () => {
    if (!validatePaymentDetails()) {
      return; // Sortir de la fonction si les détails de paiement ne sont pas valides
    }

    // Si les détails de paiement sont valides, continuer avec le paiement
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/api/commandes/${clientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          dateCommande: today, // Format LocalDate (YYYY-MM-DD)
          montantTotal: total, // Assurez-vous que totalAmount est défini
          statut: 'confirmé',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      console.log('Order created:', await response.json());

      // Suppression des lignes du panier
      for (const ligne of cartItems) {
        const deleteResponse = await fetch(`/api/lignesPanier/${ligne.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!deleteResponse.ok) {
          console.error(`Failed to delete lignePanier with id ${ligne.id}`);
        } else {
          console.log(`LignePanier with id ${ligne.id} deleted`);
        }
      }

      // Réinitialisation du compteur de panier à zéro après suppression
      updateCartCount(0);

      // Effacer les détails de la carte après le paiement réussi
      setCardDetails({
        nameOnCard: '',
        cardNumber: '',
        expirationMonth: '01',
        expirationYear: '2024',
        securityCode: ''
      });

      // Effacer les éventuelles erreurs de paiement
      setPaymentError(null);

      // (Par exemple, vider le panier dans votre state management, rediriger l'utilisateur, etc.)

    } catch (error) {
      console.error('Error during payment process:', error);
      setPaymentError('Une erreur s\'est produite lors du traitement du paiement. Veuillez réessayer.');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 py-5 ml-[80px]">
      <div className="px-5">
        <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
          
          <div className="w-full">
            <div className="-mx-3 md:flex items-start">
              <div className="px-3 md:w-7/12 lg:pr-10">
                {cartItems.map((item, index) => (
                  <div key={index} className="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6">
                    <div className="w-full flex items-center">
                      <div className="overflow-hidden rounded-lg w-16 h-16 bg-gray-50 border border-gray-200">
                        <img src={item.instrument.images[0].url} alt={item.instrument.images[0].url} />
                      </div>
                      <div className="flex-grow pl-3">
                        <h6 className="font-semibold uppercase text-gray-600">{item.name}</h6>
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
                      <span className="font-semibold">{subTotal}</span>
                    </div>
                  </div>
                  <div className="w-full flex items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Livraison</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">{shippingCostFinal}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
                  <div className="w-full flex items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Total</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">
                        {total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 md:w-5/12">
                <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
                  <div className="w-full flex mb-3 items-center">
                    <div className="w-32">
                      <span className="text-gray-600 font-semibold">Contact</span>
                    </div>
                    <div className="flex-grow pl-3">
                      <span>insturment SHOP</span>
                    </div>
                  </div>
                  
                </div>
                <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
                  <div className="w-full p-3 border-b border-gray-200">
                    <div className="mb-5">
                      <label htmlFor="type1" className="flex items-center cursor-pointer">
                        <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type1" defaultChecked />
                        <img src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png" className="h-6 ml-3" />
                      </label>
                    </div>
                    <div>
                      <div className="mb-3">
                        <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Name on card</label>
                        <div>
                          <input
                            className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="John Smith"
                            type="text"
                            name="nameOnCard"
                            value={cardDetails.nameOnCard}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Card number</label>
                        <div>
                          <input
                            className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="0000 0000 0000 0000"
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="mb-3 -mx-2 flex items-end">
                        <div className="px-2 w-1/4">
                          <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Expiration date</label>
                          <div>
                            <select
                              className="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                              name="expirationMonth"
                              value={cardDetails.expirationMonth}
                              onChange={handleInputChange}
                            >
                              <option value="01">01 - January</option>
                              <option value="02">02 - February</option>
                              <option value="03">03 - March</option>
                              <option value="04">04 - April</option>
                              <option value="05">05 - May</option>
                              <option value="06">06 - June</option>
                              <option value="07">07 - July</option>
                              <option value="08">08 - August</option>
                              <option value="09">09 - September</option>
                              <option value="10">10 - October</option>
                              <option value="11">11 - November</option>
                              <option value="12">12 - December</option>
                            </select>
                          </div>
                        </div>
                        <div className="px-2 w-1/4">
                          <select
                            className="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                            name="expirationYear"
                            value={cardDetails.expirationYear}
                            onChange={handleInputChange}
                          >
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                          </select>
                        </div>
                        <div className="px-2 w-1/4">
                          <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">CVV</label>
                          <div>
                            <input
                              className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                              placeholder="000"
                              type="text"
                              name="securityCode"
                              value={cardDetails.securityCode}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {paymentError && <div className="text-red-500 mb-4">{paymentError}</div>}
                <button
                  onClick={handlePayment}
                  className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-2 font-semibold"
                >
                  PAY NOW
                </button>
              </div>
            </div>
          </div>
       
          </div>
    </div>
  </div>

);
};

export default PaymentForm;
