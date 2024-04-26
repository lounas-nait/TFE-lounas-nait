-- Créer la table Client
CREATE TABLE client (
    id UUID PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL
);

-- Ajouter une contrainte pour s'assurer que l'id de Client est également présent dans Utilisateur
ALTER TABLE client
ADD CONSTRAINT fk_client_utilisateur FOREIGN KEY (id) REFERENCES utilisateur (id);
