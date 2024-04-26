CREATE TABLE avis (
    id UUID PRIMARY KEY,
    commentaire VARCHAR(255),
    note FLOAT,
    instrument_id UUID NOT NULL,
    client_id UUID NOT NULL,
    admin_id UUID NOT NULL,
    CONSTRAINT fk_instrument
        FOREIGN KEY (instrument_id)
        REFERENCES instrument (id),
    CONSTRAINT fk_client
        FOREIGN KEY (client_id)
        REFERENCES client (id),
    CONSTRAINT fk_admin
        FOREIGN KEY (admin_id)
        REFERENCES admin (id)
);
