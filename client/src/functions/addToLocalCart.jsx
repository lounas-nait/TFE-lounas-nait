const addToLocalCart = (selectedInstrument, quantite) => {
    
    const localCart = JSON.parse(localStorage.getItem('localCart')) || [];
    
    
    localCart.push({ instrument: selectedInstrument, quantite });
    
   
    localStorage.setItem('localCart', JSON.stringify(localCart));
  };
  export default addToLocalCart;