
export const addToLocalCart = (instrument, quantite, updateCartCount) => {
  // Récupérer le panier actuel depuis le localStorage
  let localCart = JSON.parse(localStorage.getItem('localCart')) || [];

  // Vérifier si l'instrument est déjà dans le panier
  const existingInstrumentIndex = localCart.findIndex(item => item.id === instrument.id);

  if (existingInstrumentIndex !== -1) {
    // Si l'instrument est déjà dans le panier, mettre à jour la quantité
    localCart[existingInstrumentIndex].quantite += quantite;
  } else {
    // Si l'instrument n'est pas encore dans le panier, l'ajouter
    localCart.push({ ...instrument, quantite });

    // Incrémenter le compteur du panier
    updateCartCount(prevCount => prevCount + quantite);
  }

  // Enregistrer le panier mis à jour dans le localStorage
  localStorage.setItem('localCart', JSON.stringify(localCart));
};
