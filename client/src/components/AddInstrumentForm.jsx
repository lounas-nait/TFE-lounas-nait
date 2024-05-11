import React, { useState } from "react";
import { Alert, Spinner, InputGroup } from "react-bootstrap";
import useSWR from "swr";
import TopBar from "./TopBar";


const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function AddInstrumentForm() {
    const [instrument, setInstrument] = useState({
        nom: "",
        marque: "",
        description: "",
        prixTVA: "",
        prixHorsTVA: "",
        quantiteEnStock: ""
    });
    const [validated, setValidated] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showErreur, setShowErreur] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [categorieId, setCategorieId] = useState("");
  
    const handleFormSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        if (form.checkValidity() === true) {
            setFormDisabled(true);
            fetch(`/api/instruments/${categorieId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(instrument),
            })
                .then(() => {
                    setInstrument({
                        nom: "",
                        marque: "",
                        description: "",
                        prixTVA: "",
                        prixHorsTVA: "",
                        quantiteEnStock: "",
                    });
                    setCategorieId("");
                    setFormDisabled(false);
                    setShowNotif(true);
                    setValidated(false);

                    
                })
                .catch((error) => {
                    console.error("Erreur lors de l'ajout de l'instrument:", error);
                    setShowErreur(true);
                    setFormDisabled(false);
                });
        } else {
            setValidated(true);
        }
    };

    const handleChange = (field, value) => {
        if (field === "categorieId") {
            setCategorieId(value);
        } else {
            setInstrument({ ...instrument, [field]: value });
        }
        setShowNotif(false);
    };

    const { data: categories, error } = useSWR("/api/categories", fetcher);

    if (error) {
        return <div>Erreur: Impossible de charger les catégories</div>;
    }

    if (!categories) {
        return <Spinner animation="border" />;
    }

    return (
      <div>
      <TopBar />
        <div className="flex items-center justify-center p-12">

  <div className="mx-auto w-full max-w-[550px]">
    <form onSubmit={handleFormSubmit} noValidate validated={validated}>
      <div className="mb-5">
        
        <label
          for="name"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
            Nom
            </label>
          <input
            type="text"
            placeholder="Nom de l'instrument"
            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={instrument.nom}
            onChange={(e) => handleChange("nom", e.target.value)}
            required
          />
          
        
      </div>
      <div className="mb-5">
      <label
          for="email"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
          Marque
        </label>
          <input
            type="text"
            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={instrument.marque}
            onChange={(e) => handleChange("marque", e.target.value)}
            required
          />
          
      </div>
      <div className="mb-5">
      <label
          for="subject"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
          Subject
        </label>
          <input
            as="textarea"
            rows={3}
            placeholder="Description de l'instrument"
            class="w-full rounded-md border border-[#e0e0e0] bg-white py-10 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={instrument.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />
        
      </div>
      <div className="mb-5">
      <label
          for="message"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
          prix hors TVA
        </label>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Prix hors TVA de l'instrument"
            class="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={instrument.prixHorsTVA}
            onChange={(e) => handleChange("prixHorsTVA", e.target.value)}
            required
          />
         
      </div>
      <div className="mb-5">
      <label
          for="message"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
          prix TVA
        </label>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Prix TVA de l'instrument"
            class="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={instrument.prixTVA}
            onChange={(e) => handleChange("prixTVA", e.target.value)}
            required
          />
          
        
      </div>
      <div className="mb-5">
      <label
          for="message"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
          quantité en stock
        </label>
          <input
            type="number"
            min="0"
            placeholder="Quantité en stock de l'instrument"
            class="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={instrument.quantiteEnStock}
            onChange={(e) => handleChange("quantiteEnStock", e.target.value)}
            required
          />
          
      </div>
      <div className="mb-5">
      <label
          for="message"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
          quantité en stock
        </label>
          <select
          class="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            onChange={(e) => handleChange("categorieId", e.target.value)}
            required
          >
            
            <option value=""
            class="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md">Sélectionner une catégorie...</option>
            {categories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.nom}
              </option>
            ))}
          </select>
          
      </div>
      <div className="mb-5">
        <button class="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none" type="submit" disabled={formDisabled}>
          Ajouter
        </button>
      </div>
      {showNotif && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowNotif(false)}
        >
          Instrument ajouté avec succès.
        </Alert>
      )}
      {showErreur && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setShowErreur(false)}
        >
          Une erreur s'est produite lors de l'ajout de l'instrument.
        </Alert>
      )}
    </form>
  </div>
</div>
</div>
    );
}
