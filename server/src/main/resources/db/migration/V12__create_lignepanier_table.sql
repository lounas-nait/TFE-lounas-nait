CREATE TABLE ligne_panier (
    id UUID NOT NULL PRIMARY KEY,
    quantite INT NOT NULL,
    instrument_id UUID NOT NULL,
    panier_id UUID NOT NULL,
    FOREIGN KEY (instrument_id) REFERENCES instrument(id),
    FOREIGN KEY (panier_id) REFERENCES panier(id)
);
