package eafcuccle.tfe.lounasnaitecommerce.controller;

import java.net.URI;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.util.UriComponentsBuilder;

import eafcuccle.tfe.lounasnaitecommerce.classes.Avis;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.Avis;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;

import eafcuccle.tfe.lounasnaitecommerce.classes.Categorie;
import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.LignePanier;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;
import eafcuccle.tfe.lounasnaitecommerce.repositories.AvissRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.ClientRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.PanierRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.UtilisateurRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.LignePanierRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.core.Authentication;

import java.net.URI;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@RestController

public class AvisController {

    private final ClientRepository clientRepository;
    private final AvissRepository avissRepository;
    private final InstrumentRepository instrumentRepository;

    private static final Logger logger = LoggerFactory.getLogger(PanierController.class);

    @Autowired
    public AvisController(ClientRepository clientRepository,
            InstrumentRepository instrumentRepository,
            AvissRepository avissRepository) {
        this.clientRepository = clientRepository;
        this.avissRepository = avissRepository;
        this.instrumentRepository = instrumentRepository;
    }

    @PostMapping("/api/aviss/{idClient}/{idInstrument}")
    public ResponseEntity<Avis> addOrUpdateAvisToInstrument(@PathVariable("idClient") String idClientString,
            @PathVariable("idInstrument") String idInstrumentString,
            @RequestBody Avis avis,
            UriComponentsBuilder builder) {
        UUID idClient = UUID.fromString(idClientString);
        UUID idInstrument = UUID.fromString(idInstrumentString);

        Optional<Client> clientOptional = clientRepository.findById(idClient);
        Optional<Instrument> instrumentOptional = instrumentRepository.findById(idInstrument);

        if (clientOptional.isPresent() && instrumentOptional.isPresent()) {
            Client client = clientOptional.get();
            Instrument instrument = instrumentOptional.get();

            avis.setId(UUID.randomUUID());
            avis.setClient(client);
            avis.setInstrument(instrument);

            Avis savedAvis = avissRepository.save(avis);
            URI linkToNewAvis = builder.path("/api/aviss/{id}")
                    .buildAndExpand(savedAvis.getId()).toUri();

            return ResponseEntity.created(linkToNewAvis).body(savedAvis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
