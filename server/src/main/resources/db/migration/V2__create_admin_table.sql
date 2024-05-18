-- Créer la table Admin
CREATE TABLE admin (
    id UUID PRIMARY KEY
    
);

-- Ajouter une contrainte pour s'assurer que l'id d'Admin est également présent dans Utilisateur
ALTER TABLE admin
ADD CONSTRAINT fk_admin_utilisateur FOREIGN KEY (id) REFERENCES utilisateur (id);

