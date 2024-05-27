CREATE TABLE panier (
    id UUID NOT NULL PRIMARY KEY,
    client_id UUID NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client(id)
);

/*
UPDATE panier
  SET client_id = '3e5a8c12-6e2b-44b8-a196-030d26c19ff6'
  WHERE client_id IS NULL;
ALTER TABLE panier
  ALTER COLUMN client_id SET NOT NULL;

ALTER TABLE panier
    ADD CONSTRAINT fk_panier_client_id FOREIGN KEY (client_id) REFERENCES client (id);
CREATE INDEX idx_panier_client_id ON panier (client_id);
*/