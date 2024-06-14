package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Categorie;
import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.LignePanier;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;
import eafcuccle.tfe.lounasnaitecommerce.repositories.ClientRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.PanierRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.UtilisateurRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.LignePanierRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@RestController

public class PanierController {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final PanierRepository panierRepository;
    private final LignePanierRepository lignePanierRepository;
    private final InstrumentRepository instrumentRepository;

    private static final Logger logger = LoggerFactory.getLogger(PanierController.class);

    @Autowired
    public PanierController(ClientRepository clientRepository, PanierRepository panierRepository,
            UtilisateurRepository utilisateurRepository, LignePanierRepository lignePanierRepository,
            InstrumentRepository instrumentRepository) {
        this.clientRepository = clientRepository;
        this.panierRepository = panierRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.lignePanierRepository = lignePanierRepository;
        this.instrumentRepository = instrumentRepository;
    }

    @GetMapping("/api/paniers/client/{clientId}")
    public ResponseEntity<Panier> getPanierByClientId(@PathVariable UUID clientId) {
        Optional<Panier> panier = panierRepository.findByClientId(clientId);
        if (panier.isPresent()) {
            return ResponseEntity.ok(panier.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/paniers")
    public ResponseEntity<Panier> getAllPaniers(Authentication authentication) {
        if (authentication == null) {
            System.out.println("Authentication is null");
            return ResponseEntity.noContent().build(); // Retourner une réponse vide
        }
        System.out.println("Authentication is not null");
        String username = authentication.getName();
        System.out.println("Authenticated username: " + username);
        Optional<Client> owner = clientRepository.findByAuth0Id(username);
        System.out.println("owner: " + owner.get());
        if (owner.isPresent()) {
            Client client = owner.get();
            Panier panier = panierRepository.findByClient(client);
            return ResponseEntity.ok(panier);
        }
        return ResponseEntity.noContent().build(); // Retourner une réponse vide
    }

    @GetMapping("/api/paniers/{id}/lignesPanier")
    public ResponseEntity<List<LignePanier>> getLignesPanierFromPanier(@PathVariable("id") String panierIdString) {
        UUID panierId = UUID.fromString(panierIdString);

        Optional<Panier> panierOptional = panierRepository.findById(panierId);

        if (panierOptional.isPresent()) {
            Panier panier = panierOptional.get();
            List<LignePanier> lignesPanier = lignePanierRepository.findByPanier(panier);

            return ResponseEntity.ok().body(lignesPanier);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/lignesPanier/{id}/{idInstrument}")
    public ResponseEntity<LignePanier> addOrUpdateLignePanierToPanier(@PathVariable("id") String panierIdString,
            @PathVariable("idInstrument") String instrumentIdString,
            @RequestBody LignePanier lignePanier,
            UriComponentsBuilder builder) {
        UUID panierId = UUID.fromString(panierIdString);
        UUID instrumentId = UUID.fromString(instrumentIdString);

        Optional<Panier> panierOptional = panierRepository.findById(panierId);
        Optional<Instrument> instrumentOptional = instrumentRepository.findById(instrumentId);

        if (panierOptional.isPresent() && instrumentOptional.isPresent()) {
            Panier panier = panierOptional.get();
            Instrument instrument = instrumentOptional.get();

            Optional<LignePanier> existingLignePanierOptional = lignePanierRepository.findByPanierAndInstrument(panier,
                    instrument);

            if (existingLignePanierOptional.isPresent()) {

                LignePanier existingLignePanier = existingLignePanierOptional.get();
                existingLignePanier.setQuantite(lignePanier.getQuantite());
                LignePanier updatedLignePanier = lignePanierRepository.save(existingLignePanier);

                return ResponseEntity.ok().body(updatedLignePanier);
            } else {

                lignePanier.setId(UUID.randomUUID());
                lignePanier.setPanier(panier);
                lignePanier.setInstrument(instrument);

                LignePanier savedLignePanier = lignePanierRepository.save(lignePanier);
                URI linkToNewLignePanier = builder.path("/api/lignePaniers/{id}")
                        .buildAndExpand(savedLignePanier.getId()).toUri();

                return ResponseEntity.created(linkToNewLignePanier).body(savedLignePanier);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/lignesPanier/{idPanier}/{id}")
    @Transactional
    public ResponseEntity<Void> deleteLignePanier(@PathVariable UUID id) {
        Optional<LignePanier> lignePanierOptional = lignePanierRepository.findById(id);
        if (lignePanierOptional.isPresent()) {
            LignePanier lignePanier = lignePanierOptional.get();

            lignePanierRepository.delete(lignePanier);

            logger.info("Instrument supprimée : {}", lignePanier);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
