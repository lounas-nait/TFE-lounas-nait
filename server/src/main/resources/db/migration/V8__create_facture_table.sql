CREATE TABLE facture (
    id UUID NOT NULL PRIMARY KEY,
    montantHT FLOAT NOT NULL,
    montantTVA FLOAT NOT NULL,
    commande_id UUID NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commande(id)
);
