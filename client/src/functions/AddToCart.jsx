const addToCart = async (selectedInstrument, cartItemsData, cartCount, updateCartCount, quantite, getAccessTokenSilently, setErrorMessage) => {
  if (selectedInstrument && cartItemsData && cartItemsData.id) {
    try {
      const accessToken = await getAccessTokenSilently();
      let updatedQuantite = quantite;

      
      const existingItem = cartItemsData.lignesPanier.find(item => item.instrument.id === selectedInstrument.id);
      
      if (existingItem) {
        
        updatedQuantite += existingItem.quantite;
      }

     
      if (updatedQuantite > selectedInstrument.quantiteEnStock) {
        throw new Error('La quantité demandée dépasse la quantité en stock.');
      }

      const response = await fetch(`/api/lignesPanier/${cartItemsData.id}/${selectedInstrument.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quantite: updatedQuantite
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const result = await response.json();
      console.log('Article ajouté au panier:', result);

      if (!existingItem) {
       
        updateCartCount(cartCount + 1); 
        console.log(cartCount);
      }

      setErrorMessage('');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setErrorMessage(error.message); 
    }
  }
};

export default addToCart;
