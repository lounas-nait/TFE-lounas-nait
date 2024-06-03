import React, { useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import useSWR from "swr";
import TopBar from "../menu/TopBar";
import { useAuth0 } from "@auth0/auth0-react";
import FormHandler from "./FormHandler";

export function AddInstrumentForm() {
    const [instrument, setInstrument] = useState({
        nom: "",
        marque: "",
        description: "",
        prixTVA: "",
        prixHorsTVA: "",
        quantiteEnStock: "",
        imageUrls: [],
    });
    const [validated, setValidated] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showErreur, setShowErreur] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [categorieId, setCategorieId] = useState("");

    const { data: categories, error } = useSWR("/api/categories", async (url) => {
        return fetch(url, {
            headers: { Accept: "application/json" },
        }).then((r) => r.json());
    });

    if (error) {
        return <div>Erreur: Impossible de charger les catégories</div>;
    }

    if (!categories) {
        return <Spinner animation="border" />;
    }

    return (
        <div>
            <TopBar />
            <br /><br />
            <div className="flex items-center justify-center p-12">
                <div className="mx-auto w-full max-w-[550px]">
                    <FormHandler
                        instrument={instrument}
                        setInstrument={setInstrument}
                        validated={validated}
                        setValidated={setValidated}
                        showNotif={showNotif}
                        setShowNotif={setShowNotif}
                        showErreur={showErreur}
                        setShowErreur={setShowErreur}
                        formDisabled={formDisabled}
                        setFormDisabled={setFormDisabled}
                        categorieId={categorieId}
                        setCategorieId={setCategorieId}
                        categories={categories}
                    />
                </div>
            </div>
        </div>
    );
}
