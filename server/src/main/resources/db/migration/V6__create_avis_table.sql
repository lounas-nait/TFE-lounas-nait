CREATE TABLE avis (
    id UUID PRIMARY KEY,
    commentaire VARCHAR(255),
    note FLOAT,
    instrument_id UUID NOT NULL,
    client_id UUID NOT NULL,
    
   
        FOREIGN KEY (instrument_id)
        REFERENCES instrument (id),
    
        FOREIGN KEY (client_id)
        REFERENCES client (id)

        
    
);
