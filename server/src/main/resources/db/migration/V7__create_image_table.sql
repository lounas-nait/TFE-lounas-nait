CREATE TABLE image (
    id UUID NOT NULL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    instrument_id UUID NOT NULL,
    FOREIGN KEY (instrument_id) REFERENCES instrument(id)
);
