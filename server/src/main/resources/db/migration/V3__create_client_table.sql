-- Créer la table Client
CREATE TABLE client (
    id UUID PRIMARY KEY
   
);

-- Ajouter une contrainte pour s'assurer que l'id de Client est également présent dans Utilisateur
ALTER TABLE client
ADD CONSTRAINT fk_client_utilisateur FOREIGN KEY (id) REFERENCES utilisateur (id);
