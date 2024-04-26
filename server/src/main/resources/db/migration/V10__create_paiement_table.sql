CREATE TABLE paiement (
    id UUID PRIMARY KEY,
    mode_paiement_id UUID NOT NULL,
    facture_id UUID NOT NULL,
    FOREIGN KEY (mode_paiement_id) REFERENCES mode_paiement(id),
    FOREIGN KEY (facture_id) REFERENCES facture(id)
);
