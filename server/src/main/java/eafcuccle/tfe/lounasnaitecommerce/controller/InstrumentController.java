package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/instruments")
public class InstrumentController {

    private final InstrumentRepository instrumentRepository;

    private static final Logger logger = LoggerFactory.getLogger(InstrumentController.class);

    @Autowired
    public InstrumentController(InstrumentRepository instrumentRepository) {
        this.instrumentRepository = instrumentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Instrument>> getAllInstruments(@RequestParam(required = false) String q) {
        List<Instrument> instruments;
        if (StringUtils.hasText(q)) {
            // Si un paramètre de recherche est fourni, filtrer les instruments par nom
            instruments = instrumentRepository.findByNomContainingIgnoreCase(q);
        } else {
            // Sinon, récupérer tous les instruments
            instruments = instrumentRepository.findAll();
        }
        return ResponseEntity.ok(instruments);
    }

    @PostMapping
    public ResponseEntity<Instrument> addInstrument(@RequestBody Instrument instrument, UriComponentsBuilder builder) {
        instrument.setId(UUID.randomUUID()); // Générer un nouvel ID pour l'instrument
        Instrument savedInstrument = instrumentRepository.save(instrument); // Sauvegarder l'instrument dans la base de
                                                                            // données
        logger.info("Instrument ajoutée : {}", savedInstrument);
        URI linkToNewInstrument = builder.pathSegment("api", "instruments", "{id}").build(savedInstrument.getId());
        return ResponseEntity.created(linkToNewInstrument).body(savedInstrument);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instrument> getInstrumentDetails(@PathVariable UUID id) {
        Optional<Instrument> instrumentOptional = instrumentRepository.findById(id);
        if (instrumentOptional.isPresent()) {
            Instrument instrument = instrumentOptional.get();
            return ResponseEntity.ok(instrument);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
