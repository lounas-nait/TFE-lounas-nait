import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const FormHandler = ({
    instrument,
    setInstrument,
    validated,
    setValidated,
    showNotif,
    setShowNotif,
    showErreur,
    setShowErreur,
    formDisabled,
    setFormDisabled,
    categorieId,
    setCategorieId,
    categories
}) => {
    const { getAccessTokenSilently } = useAuth0();
    const [newImageUrl, setNewImageUrl] = useState("");

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);

        const form = event.target;
        if (form.checkValidity() === true) {
            setFormDisabled(true);

            const instrumentDTO = {
                ...instrument,
                categorieId: categorieId,
            };

            try {
                const accessToken = await getAccessTokenSilently();
                const response = await fetch(`/api/instruments/${categorieId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(instrumentDTO),
                });

                if (!response.ok) {
                    throw new Error('Failed to add instrument');
                }

                setInstrument({
                    nom: "",
                    marque: "",
                    description: "",
                    prixTVA: "",
                    prixHorsTVA: "",
                    quantiteEnStock: "",
                    imageUrls: [],
                });
                setCategorieId("");
                setFormDisabled(false);
                setShowNotif(true);
                setValidated(false);
            } catch (error) {
                console.error("Erreur lors de l'ajout de l'instrument:", error);
                setShowErreur(true);
                setFormDisabled(false);
            }
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

    const addImageUrl = () => {
        if (newImageUrl) {
            setInstrument({
                ...instrument,
                imageUrls: [...instrument.imageUrls, newImageUrl],
            });
            setNewImageUrl("");
        }
    };

    const removeImageUrl = (index) => {
        const updatedImageUrls = [...instrument.imageUrls];
        updatedImageUrls.splice(index, 1);
        setInstrument({
            ...instrument,
            imageUrls: updatedImageUrls,
        });
    };

    return (
        <form onSubmit={handleFormSubmit} noValidate>
            <div className="mb-5">
                <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
                    Nom
                </label>
                <input
                    type="text"
                    placeholder="Nom de l'instrument"
                    className={`w-full rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.nom ? "border-red-500" : "border-[#e0e0e0]"}`}
                    value={instrument.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="marque" className="mb-3 block text-base font-medium text-[#07074D]">
                    Marque
                </label>
                <input
                    type="text"
                    className={`w-full rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.marque ? "border-red-500" : "border-[#e0e0e0]"}`}
                    value={instrument.marque}
                    onChange={(e) => handleChange("marque", e.target.value)}
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="description" className="mb-3 block text-base font-medium text-[#07074D]">
                    Description
                </label>
                <textarea
                    rows={3}
                    placeholder="Description de l'instrument"
                    className={`w-full rounded-md border bg-white py-10 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.description ? "border-red-500" : "border-[#e0e0e0]"}`}
                    value={instrument.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="prixHorsTVA" className="mb-3 block text-base font-medium text-[#07074D]">
                    Prix hors TVA
                </label>
                <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Prix hors TVA de l'instrument"
                    className={`w-full resize-none rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.prixHorsTVA ? "border-red-500" : "border-[#e0e0e0]"}`}
                    value={instrument.prixHorsTVA}
                    onChange={(e) => handleChange("prixHorsTVA", e.target.value)}
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="prixTVA" className="mb-3 block text-base font-medium text-[#07074D]">
                    Prix TVA incluse
                </label>
                <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Prix TVA incluse de l'instrument"
                    className={`w-full resize-none rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.prixTVA ? "border-red-500" : "border-[#e0e0e0]"}`}
                    value={instrument.prixTVA}
                    onChange={(e) => handleChange("prixTVA", e.target.value)}
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="quantiteEnStock" className="mb-3 block text-base font-medium text-[#07074D]">
                    Quantité en stock
                </label>
                <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Quantité en stock"
                    className={`w-full resize-none rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !instrument.quantiteEnStock ? "border-red-500" : "border-[#e0e0e0]"}`}
                    value={instrument.quantiteEnStock}
                    onChange={(e) => handleChange("quantiteEnStock", e.target.value)}
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="categorie" className="mb-3 block text-base font-medium text-[#07074D]">
                    Catégorie
                </label>
                <select
                    className={`w-full rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${validated && !categorieId ? "border-red-500" : "border-[#e0e0e0]"}`}
                    value={categorieId}
                    onChange={(e) => handleChange("categorieId", e.target.value)}
                    required
                >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.nom}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-5">
                <label htmlFor="images" className="mb-3 block text-base font-medium text-[#07074D]">
                    URLs des Images
                </label>
                <div className="flex flex-col space-y-2">
                    {instrument.imageUrls.map((url, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={url}
                                className="w-full rounded-md border bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                readOnly
                            />
                            <button
                                type="button"
                                className="rounded-md bg-red-500 py-2 px-4 text-white"
                                onClick={() => removeImageUrl(index)}
                            >
                                Supprimer
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Ajouter une URL d'image"
                            className="w-full rounded-md border bg-white py-2 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <button
                            type="button"
                            className="rounded-md bg-green-500 py-2 px-4 text-white"
                            onClick={addImageUrl}
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <button
                    className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    type="submit"
                    disabled={formDisabled}
                >
                    Ajouter un instrument
                </button>
            </div>
            {showNotif && (
                <Alert
                    variant="success"
                    onClose={() => setShowNotif(false)}
                    dismissible
                    className="mt-3"
                >
                    Instrument ajouté avec succès !
                </Alert>
            )}
            {showErreur && (
                <Alert
                    variant="danger"
                    onClose={() => setShowErreur(false)}
                    dismissible
                    className="mt-3"
                >
                    Une erreur est survenue lors de l'ajout de l'instrument.
                </Alert>
            )}
        </form>
    );
};

export default FormHandler;
