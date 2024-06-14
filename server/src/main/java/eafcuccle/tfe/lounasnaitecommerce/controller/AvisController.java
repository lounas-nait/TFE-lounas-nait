package eafcuccle.tfe.lounasnaitecommerce.controller;

import java.net.URI;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;
import eafcuccle.tfe.lounasnaitecommerce.classes.Avis;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.repositories.AvissRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.ClientRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class AvisController {

    private final ClientRepository clientRepository;
    private final AvissRepository avissRepository;
    private final InstrumentRepository instrumentRepository;

    @Autowired
    public AvisController(ClientRepository clientRepository,
            InstrumentRepository instrumentRepository,
            AvissRepository avissRepository) {
        this.clientRepository = clientRepository;
        this.avissRepository = avissRepository;
        this.instrumentRepository = instrumentRepository;
    }

    @GetMapping("/api/aviss")
    public List<Avis> getAllAvis() {
        return avissRepository.findAll();
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
