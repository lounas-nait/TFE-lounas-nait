export const addToLocalCart = (selectedInstrument, quantite, updateCartCount, setErrorMessage) => {
  // Récupérer le panier actuel depuis le localStorage
  let localCart = JSON.parse(localStorage.getItem('localCart')) || [];

  // Vérifier si l'instrument est déjà dans le panier local
  const existingInstrumentIndex = localCart.findIndex(item => item.id === selectedInstrument.id);

  if (existingInstrumentIndex !== -1) {
    // Si l'instrument est déjà dans le panier, vérifier et mettre à jour la quantité
    const totalQuantite = localCart[existingInstrumentIndex].quantite + quantite;

    if (totalQuantite > selectedInstrument.quantiteEnStock) {
      // Gérer l'erreur si la quantité demandée dépasse la quantité en stock
      setErrorMessage('La quantité demandée dépasse la quantité en stock.');
      return; // Arrêter l'exécution de la fonction
    }

    // Mettre à jour la quantité dans le panier local
    localCart[existingInstrumentIndex].quantite += quantite;
  } else {
    // Si l'instrument n'est pas encore dans le panier, vérifier la quantité
    if (quantite > selectedInstrument.quantiteEnStock) {
      // Gérer l'erreur si la quantité demandée dépasse la quantité en stock
      setErrorMessage('La quantité demandée dépasse la quantité en stock.');
      return; // Arrêter l'exécution de la fonction
    }

    // Ajouter l'instrument au panier local avec la quantité spécifiée
    localCart.push({ ...selectedInstrument, quantite });

    // Incrémenter le compteur du panier
    updateCartCount(prevCount => prevCount + quantite);
  }

  // Enregistrer le panier mis à jour dans le localStorage
  localStorage.setItem('localCart', JSON.stringify(localCart));
};
