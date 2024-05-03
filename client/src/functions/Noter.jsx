export const calculMoyenne = (instruments) => {
    return instruments.map((instrument) => {
      // Calculer la note moyenne
      const totalNotes = instrument.avis.reduce((acc, avis) => acc + avis.note, 0);
      const averageRating = instrument.avis.length > 0 ? totalNotes / instrument.avis.length : 0;

      // Retourner l'instrument mis à jour avec la note moyenne
      return { ...instrument, averageRating };
    });
  };