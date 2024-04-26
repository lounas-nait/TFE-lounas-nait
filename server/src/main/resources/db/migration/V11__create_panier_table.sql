CREATE TABLE panier (
    id UUID NOT NULL PRIMARY KEY,
    client_id UUID NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client(id)
);

