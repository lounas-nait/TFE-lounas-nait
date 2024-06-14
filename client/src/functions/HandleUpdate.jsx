import useSWR, { mutate } from 'swr';

const handleUpdate = async (selectedInstrument, updatedQuantiteEnStock, updatedPrixTVA, getAccessTokenSilently, searchURL, setSelectedInstrument, setErrorMessage) => {
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
        prixTVA: updatedPrixTVA,
      }),
    });

    if (!response.ok) {
      throw new Error('Échec de la mise à jour de l\'instrument');
    }

    mutate(searchURL);
    setSelectedInstrument({
      ...selectedInstrument,
      quantiteEnStock: updatedQuantiteEnStock,
      prixTVA: updatedPrixTVA, 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'instrument :', error);
    setErrorMessage('Erreur lors de la mise à jour de l\'instrument.');
  }
};

export default handleUpdate;
