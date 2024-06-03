import useSWR, { mutate } from 'swr';

const handleUpdate = async (selectedInstrument, updatedQuantiteEnStock, getAccessTokenSilently, searchURL, setSelectedInstrument, setErrorMessage) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/api/instruments/${selectedInstrument.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quantiteEnStock: updatedQuantiteEnStock,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update instrument');
      }
  
      mutate(searchURL);
      setSelectedInstrument({
        ...selectedInstrument,
        quantiteEnStock: updatedQuantiteEnStock,
      });
    } catch (error) {
      console.error('Error updating instrument:', error);
      setErrorMessage('Erreur lors de la mise à jour de l\'instrument.');
    }
  };
  
  export default handleUpdate;
  