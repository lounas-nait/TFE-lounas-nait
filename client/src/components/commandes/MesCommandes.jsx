import React, { useState } from "react";
import useSWR from "swr";
import { useAuth0 } from "@auth0/auth0-react";

const MesCommandes = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [selectedCommande, setSelectedCommande] = useState(null);

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

  const { data, error, mutate } = useSWR("/api/commandes", fetcher);

  if (error) {
    return <div>Error loading commandes: {error.message}</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }

  const toggleDetails = (id) => {
    setSelectedCommande((prevSelected) => (prevSelected === id ? null : id));
  };

  const handleDeleteCommande = async (id) => {
    try {
      const accessToken = await getAccessTokenSilently();
      await fetch(`/api/commandes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
   
      mutate();
    } catch (error) {
      console.error("Failed to delete commande:", error);
    }
  };

  const handleAnnulerCommande = (id) => {
   
    if (user.email && user.email.startsWith("admin")) {
      handleDeleteCommande(id);
    } else {
      alert("Vous n'avez pas les autorisations nécessaires pour annuler une commande.");
    }
  };

  const handleLivrerCommande = async (id) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/api/commandes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ statut: "en livraison" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update commande");
      }

      mutate();
    } catch (error) {
      console.error("Failed to update commande:", error);
  
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-5 text-center">Commandes</h1>
      <div className="overflow-x-auto w-full">
        <table className="w-full my-0 align-middle text-dark border-neutral-200 bg-white shadow-md rounded-lg">
          <thead className="w-full align-bottom bg-gray-200">
            <tr className="font-semibold text-[0.95rem] text-secondary-dark">
              <th className="pb-3 text-start min-w-[175px] px-3 py-2">Date</th>
              <th className="pb-3 text-end min-w-[100px] px-3 py-2">Montant Total</th>
              <th className="pb-3 text-end min-w-[100px] px-3 py-2">Statut</th>
              {user.email && user.email.startsWith("admin") && (
                <>
                  <th className="pb-3 text-center min-w-[100px] px-3 py-2">Actions</th>
                  <th className="pb-3 text-center min-w-[100px] px-3 py-2">Détails</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((commande) => (
              <React.Fragment key={commande.id}>
                <tr className="border-b border-dashed last:border-b-0">
                  <td className="p-3 pl-2 px-3 py-2">{commande.dateCommande}</td>
                  <td className="p-3 pr-8 text-end px-3 py-2">{commande.montantTotal} €</td>
                  <td className={`p-3 pr-4 text-end px-3 py-2 ${commande.statut === 'confirmé' ? 'text-green-500' : commande.statut === 'en livraison' ? 'text-orange-500' : ''}`}>
                    {commande.statut}
                  </td>
                  {user.email && user.email.startsWith("admin") && commande.statut === 'confirmé' && (
                    <>
                      <td className="p-3 pr-12 text-center px-3 py-2">
                        <button
                          className="mx-1 focus:outline-none border border-red-500 rounded p-1 text-red-500"
                          onClick={() => handleAnnulerCommande(commande.id)}
                        >
                          Annuler
                        </button>
                        <button
                          className="mx-1 focus:outline-none border border-green-500 rounded p-1 text-green-500"
                          onClick={() => handleLivrerCommande(commande.id)}
                        >
                          Livrer
                        </button>
                      </td>
                      <td className="p-3 pr-12 text-center px-3 py-2">
                        <button
                          className="mx-1 focus:outline-none border border-blue-500 rounded p-1 text-blue-500"
                          onClick={() => toggleDetails(commande.id)}
                        >
                          {selectedCommande === commande.id ? "Masquer" : "Détails"}
                        </button>
                      </td>
                    </>
                  )}
                  {(!user.email || !user.email.startsWith("admin")) && (
                    <td className="p-3 pr-12 text-center px-3 py-2" colSpan="2">
                      <button
                        className="mx-1 focus:outline-none border border-blue-500 rounded p-1 text-blue-500"
                        onClick={() => toggleDetails(commande.id)}
                      >
                        {selectedCommande === commande.id ? "Masquer" : "Détails"}
                      </button>
                    </td>
                  )}
                </tr>
                {selectedCommande === commande.id && (
                  <tr className="border-b border-dashed last:border-b-0 bg-gray-100">
                    <td className="p-3 pl-0 px-3 py-2" colSpan="5">
                      {/* Afficher les détails de la commande ici */}
                      <ul className="grid grid-cols-2 gap-2">
                        {commande.lignesCommande.map((ligne) => (
                          <li key={ligne.id} className="px-3 py-2 flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden mr-2">
                              <img src={ligne.instrument.images[0].url} alt={ligne.instrument.nom} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold">{ligne.instrument.nom}</p>
                              <p className="text-sm text-gray-600">{ligne.quantite} x {ligne.prixUnitairePaye} €</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MesCommandes;
