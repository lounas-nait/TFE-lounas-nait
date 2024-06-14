package eafcuccle.tfe.lounasnaitecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import eafcuccle.tfe.lounasnaitecommerce.classes.*;
import eafcuccle.tfe.lounasnaitecommerce.repositories.*;
import eafcuccle.tfe.lounasnaitecommerce.services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class CommandeController {

    private final ClientRepository clientRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final CommandeRepository commandeRepository;
    private final PanierRepository panierRepository;
    private final InstrumentRepository instrumentRepository;
    private final LignePanierRepository lignePanierRepository;
    private final FactureRepository factureRepository;
    private final EmailService emailService;

    private static final Logger logger = LoggerFactory.getLogger(PanierController.class);

    @Autowired
    public CommandeController(ClientRepository clientRepository,
            CommandeRepository commandeRepository,
            LigneCommandeRepository ligneCommandeRepository,
            InstrumentRepository instrumentRepository,
            PanierRepository panierRepository,
            LignePanierRepository lignePanierRepository,
            FactureRepository factureRepository,
            EmailService emailService) {
        this.clientRepository = clientRepository;
        this.ligneCommandeRepository = ligneCommandeRepository;
        this.commandeRepository = commandeRepository;
        this.instrumentRepository = instrumentRepository;
        this.panierRepository = panierRepository;
        this.lignePanierRepository = lignePanierRepository;
        this.factureRepository = factureRepository;
        this.emailService = emailService;
    }

    @GetMapping("/api/commandes")
    public ResponseEntity<List<Commande>> getAllCommande(Authentication authentication) {
        String username = authentication.getName();
        System.out.println("Authenticated username: " + username);
        Optional<Client> owner = clientRepository.findByAuth0Id(username);

        // Vérifier si le client est présent dans la base de données
        if (owner.isPresent()) {
            Client client = owner.get();
            // Vérifier si l'email commence par "admin"
            if (client.getEmail().startsWith("admin")) {
                System.out.println("aderssseclient: " + client.getEmail());
                // Si oui, récupérer toutes les commandes
                List<Commande> commandes = commandeRepository.findAll();
                return ResponseEntity.ok(commandes);
            } else {
                // Sinon, récupérer les commandes du client connecté
                List<Commande> commandes = commandeRepository.findByClient(client);
                return ResponseEntity.ok(commandes);
            }
        } else {
            System.out.println("Client not found for username: " + username);
            return ResponseEntity.noContent().build(); // Retourner une réponse vide
        }
    }

    @PostMapping("/api/commandes/{idClient}")
    public ResponseEntity<Commande> createCommande(@RequestBody Commande commande,
            @PathVariable("idClient") String idClient,
            UriComponentsBuilder builder) throws MessagingException, IOException {
        commande.setId(UUID.randomUUID());

        UUID idClientUuid = UUID.fromString(idClient);

        Client client = clientRepository.findById(idClientUuid)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        commande.setClient(client);

        Panier panier = panierRepository.findByClientId(idClientUuid)
                .orElseThrow(() -> new RuntimeException("Panier not found"));

        List<LignePanier> lignesPanier = panier.getLignesPanier();

        List<LigneCommande> lignesCommande = lignesPanier.stream()
                .map(lignePanier -> {
                    LigneCommande ligneCommande = new LigneCommande();
                    ligneCommande.setId(UUID.randomUUID());
                    ligneCommande.setCommande(commande);
                    ligneCommande.setInstrument(lignePanier.getInstrument());
                    ligneCommande.setQuantite(lignePanier.getQuantite());
                    ligneCommande.setPrixUnitaireHorsTVA(lignePanier.getInstrument().getPrixHorsTVA());
                    ligneCommande.setPrixUnitairePaye(lignePanier.getInstrument().getPrixTVA());

                    Instrument instrument = lignePanier.getInstrument();
                    instrument.setQuantiteEnStock(instrument.getQuantiteEnStock() - lignePanier.getQuantite());
                    return ligneCommande;
                })
                .collect(Collectors.toList());

        commande.setLignesCommande(lignesCommande);

        Float montantHT = (float) lignesCommande.stream()
                .mapToDouble(ligneCommande -> ligneCommande.getPrixUnitaireHorsTVA() * ligneCommande.getQuantite())
                .sum();

        Float montantTotal = (float) lignesCommande.stream()
                .mapToDouble(ligneCommande -> ligneCommande.getPrixUnitairePaye() * ligneCommande.getQuantite())
                .sum();

        Commande savedCommande = commandeRepository.save(commande);

        Facture facture = new Facture();
        facture.setId(UUID.randomUUID());
        facture.setMontantHT(montantHT);
        facture.setMontantTVA(montantTotal);
        facture.setCommande(savedCommande);
        Facture savedFacture = factureRepository.save(facture);

        savedCommande.setFacture(savedFacture);
        commandeRepository.save(savedCommande);

        lignesPanier.forEach(lignePanier -> lignePanierRepository.delete(lignePanier));

        panier.setLignesPanier(new ArrayList<>());
        panierRepository.save(panier);

        // Envoyer l'email de confirmation de commande
        List<String> articles = lignesCommande.stream()
                .map(lc -> lc.getQuantite() + " x " + lc.getInstrument().getNom())
                .collect(Collectors.toList());

        emailService.sendOrderConfirmationEmail(client.getEmail(), client.getNom(), articles, montantHT, montantTotal,
                lignesCommande);

        URI linkToNewCommande = builder.pathSegment("api", "commandes", "{id}")
                .buildAndExpand(savedCommande.getId()).toUri();

        return ResponseEntity.created(linkToNewCommande).body(savedCommande);
    }

    @DeleteMapping("/api/lignesPanier/{id}")
    @Transactional
    public ResponseEntity<Void> deleteLignePanier(@PathVariable UUID id) {
        Optional<LignePanier> lignePanierOptional = lignePanierRepository.findById(id);
        if (lignePanierOptional.isPresent()) {
            LignePanier lignePanier = lignePanierOptional.get();
            lignePanierRepository.delete(lignePanier);
            logger.info("ligne supprimée : {}", lignePanier);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
