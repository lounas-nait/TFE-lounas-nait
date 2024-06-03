CREATE TABLE commande (
    id UUID PRIMARY KEY,
    date_commande VARCHAR(50) NOT NULL,
    montant_total FLOAT NOT NULL,
    statut VARCHAR(255) NOT NULL,
    client_id UUID NOT NULL,
    
    FOREIGN KEY (client_id) REFERENCES client(id)
    
);
