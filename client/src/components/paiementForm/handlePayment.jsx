import axios from 'axios';

const handlePayment = async (
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
) => {
  if (!validatePaymentDetails()) {
    return false;
  }

  try {
    const accessToken = await getAccessTokenSilently();

    // Vérifier les quantités en stock
    for (const item of cartItems) {
      if (item.quantite > item.instrument.quantiteEnStock) {
        setPaymentError(`La quantité demandée pour ${item.instrument.nom} dépasse la quantité en stock.`);
        return false; // Sortir de la fonction si la quantité en stock est insuffisante
      }
    }

    // Récupérer l'ID du mode de paiement choisi
    let modePaiementId;
    if (selectedPaymentMethod === 'Visa') {
      modePaiementId = 'b8be405d-bb46-4d8f-bd9c-83bfc6db41ab'; // Remplacez par l'ID réel de Visa
    } else if (selectedPaymentMethod === 'PayPal') {
      modePaiementId = 'b9be405d-bb46-4d8f-bd9c-83bfc6db41ab'; // Remplacez par l'ID réel de PayPal
    }

    // Envoyer la requête POST avec les détails de la commande
    const response = await fetch(`/api/commandes/${clientId}/${modePaiementId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        dateCommande: today,
        montantTotal: total,
        statut: 'confirmé',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating order:', errorData);
      throw new Error('Failed to create order');
    }

    const orderData = await response.json();
    console.log('Order created:', orderData);

    // Suppression des lignes du panier
    for (const ligne of cartItems) {
      const deleteResponse = await fetch(`/api/lignesPanier/${ligne.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!deleteResponse.ok) {
        const deleteErrorData = await deleteResponse.json();
        console.error(`Failed to delete lignePanier with id ${ligne.id}`, deleteErrorData);
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
      securityCode: '',
    });

    // Effacer les éventuelles erreurs de paiement
    setPaymentError(null);

    // Appeler la fonction pour gérer le succès de paiement
    handlePaymentSuccess();

    return true;

  } catch (error) {
    console.error('Error during payment process:', error);
    setPaymentError("Une erreur s'est produite lors du traitement du paiement. Veuillez réessayer.");
    return false;
  }
};

export default handlePayment;
