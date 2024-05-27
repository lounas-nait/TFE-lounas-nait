-- Créer la table Client
CREATE TABLE client (
    id UUID PRIMARY KEY
    
);

-- Ajouter une contrainte pour s'assurer que l'id de Client est également présent dans Utilisateur
ALTER TABLE client
ADD CONSTRAINT fk_client_utilisateur FOREIGN KEY (id) REFERENCES utilisateur (id);


/*INSERT INTO utilisateur (id, nom, email)
VALUES ('3e5a8c12-6e2b-44b8-a196-030d26c19ff6', 'auth0|649da4fb904da0045bcf77a0', 'adresse.email@example.com');


INSERT INTO client (id)
VALUES ('3e5a8c12-6e2b-44b8-a196-030d26c19ff6');

