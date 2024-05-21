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
        setValidated(true); 

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
            <form onSubmit={handleFormSubmit} noValidate>
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="Nom de l'instrument"
                  className={`w-full rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.nom ? 'border-red-500' : 'border-[#e0e0e0]'}`}
                  value={instrument.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Marque
                </label>
                <input
                  type="text"
                  className={`w-full rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.marque ? 'border-red-500' : 'border-[#e0e0e0]'}`}
                  value={instrument.marque}
                  onChange={(e) => handleChange("marque", e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="subject"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Subject
                </label>
                <input
                  as="textarea"
                  rows={3}
                  placeholder="Description de l'instrument"
                  className={`w-full rounded-md border bg-white py-10 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.description ? 'border-red-500' : 'border-[#e0e0e0]'}`}
                  value={instrument.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  prix hors TVA
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Prix hors TVA de l'instrument"
                  className={`w-full resize-none rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.prixHorsTVA ? 'border-red-500' : 'border-[#e0e0e0]'}`}
                  value={instrument.prixHorsTVA}
                  onChange={(e) => handleChange("prixHorsTVA", e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  prix TVA
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Prix TVA de l'instrument"
                  className={`w-full resize-none rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.prixTVA ? 'border-red-500' : 'border-[#e0e0e0]'}`}
                  value={instrument.prixTVA}
                  onChange={(e) => handleChange("prixTVA", e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  quantité en stock
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Quantité en stock de l'instrument"
                  className={`w-full resize-none rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.quantiteEnStock ? 'border-red-500' : 'border-[#e0e0e0]'}`}
                  value={instrument.quantiteEnStock}
                  onChange={(e) => handleChange("quantiteEnStock", e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  catégorie
                </label>
                <select
                  className={`w-full resize-none rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !categorieId ? 'border-red-500' : 'border-[#e0e0e0]'}`}
                  onChange={(e) => handleChange("categorieId", e.target.value)}
                  value={categorieId}
                  required
                >
                  <option value="">Sélectionner une catégorie...</option>
                  {categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>
                      {categorie.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <button className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none" type="submit" disabled={formDisabled}>
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
