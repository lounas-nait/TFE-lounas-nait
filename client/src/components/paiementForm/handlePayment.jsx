import axios from 'axios';

const handlePayment = async (
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
    return;
  }

  try {
    const accessToken = await getAccessTokenSilently();

    // Vérifier les quantités en stock
    for (const item of cartItems) {
      if (item.quantite > item.instrument.quantiteEnStock) {
        setPaymentError(`La quantité demandée pour ${item.instrument.nom} dépasse la quantité en stock.`);
        return; // Sortir de la fonction si la quantité en stock est insuffisante
      }
    }

    // Si les quantités en stock sont suffisantes, continuer avec le paiement
    const response = await fetch(`/api/commandes/${clientId}`, {
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

    // Appeler la fonction pour gérer le succès de paiement
    handlePaymentSuccess();

  } catch (error) {
    console.error('Error during payment process:', error);
    setPaymentError('Une erreur s\'est produite lors du traitement du paiement. Veuillez réessayer.');
  }
};

export default handlePayment;
