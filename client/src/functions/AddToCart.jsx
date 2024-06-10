const addToCart = async (selectedInstrument, cartItemsData, cartCount, updateCartCount, quantity, getAccessTokenSilently, setErrorMessage) => {
  if (selectedInstrument && cartItemsData && cartItemsData.id) {
    try {
      const accessToken = await getAccessTokenSilently();
      let updatedQuantity = quantity;

      // Vérifier si l'instrument est déjà présent dans le panier
      const existingItem = cartItemsData.lignesPanier.find(item => item.instrument.id === selectedInstrument.id);
      if (existingItem) {
        updatedQuantity += existingItem.quantite; // Ajouter la quantité déjà présente dans le panier à la nouvelle quantité demandée
      }

      // Vérifier si la quantité demandée totale est disponible en stock
      if (updatedQuantity > selectedInstrument.quantiteEnStock) {
        throw new Error('La quantité demandée dépasse la quantité en stock.');
      }

      const response = await fetch(`/api/lignesPanier/${cartItemsData.id}/${selectedInstrument.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quantite: updatedQuantity
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const result = await response.json();
      console.log('Article ajouté au panier:', result);

      if (!existingItem) {
        updateCartCount(cartCount + 1);
      }

      setErrorMessage('');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setErrorMessage(error.message); // Afficher le message d'erreur approprié
    }
  }
};

export default addToCart;
