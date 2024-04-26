-- Créer la table Admin
CREATE TABLE admin (
    id UUID PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL
);

-- Ajouter une contrainte pour s'assurer que l'id d'Admin est également présent dans Utilisateur
ALTER TABLE admin
ADD CONSTRAINT fk_admin_utilisateur FOREIGN KEY (id) REFERENCES utilisateur (id);

