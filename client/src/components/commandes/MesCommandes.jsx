import React from "react";
import useSWR from "swr";
import { useAuth0 } from "@auth0/auth0-react";

const MesCommandes = () => {
  const { getAccessTokenSilently } = useAuth0();

  const fetcher = async (url) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch commandes");
    }

    return response.json();
  };

  const { data, error } = useSWR("/api/commandes", fetcher);

  if (error) {
    return <div>Error loading commandes: {error.message}</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-5">Mes Commandes</h1>
      <div className="space-y-8">
        <br /><br /><br />
        {data.map((commande) => (
          <div key={commande.id} className="border p-4 w-96">
            <p>Date: {commande.dateCommande}</p>
            <p>Total: {commande.montantTotal} €</p>
            <div className="mt-4 space-y-2">
              <p className="font-bold">Lignes de Commande:</p>
              {commande.lignesCommande.map((ligne) => (
                <div key={ligne.id} className="flex justify-between">
                  <p>Instrument: {ligne.instrument.nom}</p>
                  <p>Quantité: {ligne.quantite}</p>
                  <p>Prix: {ligne.instrument.prixTVA} €</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MesCommandes;
