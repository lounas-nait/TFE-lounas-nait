CREATE TABLE utilisateur (
    id UUID PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mot_de_Passe VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL
);
