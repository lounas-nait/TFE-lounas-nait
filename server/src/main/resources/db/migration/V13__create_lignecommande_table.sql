CREATE TABLE ligne_commande (
    id UUID NOT NULL PRIMARY KEY,
    quantite INT NOT NULL,
    prix_unitaire_hors_tva FLOAT NOT NULL,
    prix_unitaire_paye FLOAT NOT NULL,
    commande_id UUID NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commande(id)
);
