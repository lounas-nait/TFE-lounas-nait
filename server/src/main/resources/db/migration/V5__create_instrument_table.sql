-- Créer la table Instrument
CREATE TABLE instrument (
    id UUID PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    marque VARCHAR(255),
    description TEXT,
    prix_hors_tva FLOAT NOT NULL,
    prix_tva FLOAT NOT NULL,
    quantite_en_stock INT NOT NULL,
    categorie_id UUID NOT NULL,
    admin_id UUID NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES categorie (id),
    FOREIGN KEY (admin_id) REFERENCES admin (id)
);
