

const addToCart = async (selectedInstrument, cartItemsData, cartCount, updateCartCount, quantity, getAccessTokenSilently, setErrorMessage) => {
    if (selectedInstrument && cartItemsData && cartItemsData.id) {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`/api/lignesPanier/${cartItemsData.id}/${selectedInstrument.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            quantite: quantity
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }
  
        const result = await response.json();
        console.log('Article ajouté au panier:', result);
  
        const existingItem = cartItemsData.lignesPanier.find(item => item.instrument.id === selectedInstrument.id);
        if (!existingItem) {
          updateCartCount(cartCount + 1);
        }
  
        setErrorMessage('');
      } catch (error) {
        console.error('Error adding item to cart:', error);
        setErrorMessage('Erreur lors de l\'ajout au panier.');
      }
    }
  };
  
  export default addToCart;
  