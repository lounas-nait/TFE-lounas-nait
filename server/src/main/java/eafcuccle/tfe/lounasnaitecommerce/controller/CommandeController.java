package eafcuccle.tfe.lounasnaitecommerce.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import eafcuccle.tfe.lounasnaitecommerce.classes.*;
import eafcuccle.tfe.lounasnaitecommerce.repositories.*;
import eafcuccle.tfe.lounasnaitecommerce.services.EmailAnnulationService;
import eafcuccle.tfe.lounasnaitecommerce.services.EmailLivraisonService;
import eafcuccle.tfe.lounasnaitecommerce.services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
public class CommandeController {

    private final ClientRepository clientRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final CommandeRepository commandeRepository;
    private final PanierRepository panierRepository;
    private final LignePanierRepository lignePanierRepository;
    private final FactureRepository factureRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PaiementRepository paiementRepository;
    private final ModePaiementRepository modePaiementRepository;
    private final EmailService emailService;
    private final EmailLivraisonService emailLivraisonService;
    private final EmailAnnulationService emailAnnulationService;

    private static final Logger logger = LoggerFactory.getLogger(PanierController.class);

    @Autowired
    public CommandeController(ClientRepository clientRepository,
            CommandeRepository commandeRepository,
            LigneCommandeRepository ligneCommandeRepository,
            PanierRepository panierRepository,
            LignePanierRepository lignePanierRepository,
            FactureRepository factureRepository,
            UtilisateurRepository utilisateurRepository,
            PaiementRepository paiementRepository,
            ModePaiementRepository modePaiementRepository,
            EmailService emailService,
            EmailLivraisonService emailLivraisonService,
            EmailAnnulationService emailAnnulationService) {
        this.clientRepository = clientRepository;
        this.ligneCommandeRepository = ligneCommandeRepository;
        this.commandeRepository = commandeRepository;
        this.panierRepository = panierRepository;
        this.lignePanierRepository = lignePanierRepository;
        this.factureRepository = factureRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.paiementRepository = paiementRepository;
        this.modePaiementRepository = modePaiementRepository;
        this.emailService = emailService;
        this.emailLivraisonService = emailLivraisonService;
        this.emailAnnulationService = emailAnnulationService;
    }

    @GetMapping("/api/commandes")
    public ResponseEntity<?> getAllCommande(Authentication authentication) {
        String username = authentication.getName();
        System.out.println("Authenticated username: " + username);

        // Recherche de l'utilisateur dans la table Utilisateur
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findByAuth0Id(username);

        if (utilisateurOptional.isPresent()) {
            Utilisateur utilisateur = utilisateurOptional.get();

            // Vérification du type de l'utilisateur
            if (utilisateur instanceof Client) {
                // Si c'est un Client, récupérer les commandes du client
                Client client = (Client) utilisateur;
                List<Commande> commandes = commandeRepository.findByClient(client);
                return ResponseEntity.ok(commandes);
            } else if (utilisateur instanceof Admin) {
                // Si c'est un Admin, récupérer toutes les commandes
                List<Commande> commandes = commandeRepository.findAll();
                return ResponseEntity.ok(commandes);
            } else {

                return ResponseEntity.badRequest().body("Type d'utilisateur non pris en charge");
            }
        } else {
            System.out.println("Utilisateur non trouvé pour username: " + username);
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping(value = "/api/commandes/{idClient}/{modePaiementId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> createCommande(
            @RequestBody Commande commande,
            @PathVariable("idClient") String idClient,
            @PathVariable("modePaiementId") String modePaiementId,
            UriComponentsBuilder builder) throws MessagingException, IOException {
        try {
            commande.setId(UUID.randomUUID());

            UUID idClientUuid = UUID.fromString(idClient);
            UUID idModePaiement = UUID.fromString(modePaiementId);
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

            // Enregistrement de la commande
            Commande savedCommande = commandeRepository.save(commande);

            // Création de la facture
            Facture facture = new Facture();
            facture.setId(UUID.randomUUID());
            facture.setMontantHT(montantHT);
            facture.setMontantTVA(montantTotal);
            facture.setCommande(savedCommande);
            Facture savedFacture = factureRepository.save(facture);

            // Création du paiement
            Paiement paiement = new Paiement();
            paiement.setId(UUID.randomUUID());

            // Récupérer le mode de paiement choisi par l'ID
            ModePaiement modePaiement = modePaiementRepository.findById(idModePaiement)
                    .orElseThrow(() -> new RuntimeException("Mode de paiement not found"));

            paiement.setModePaiement(modePaiement);
            paiement.setFacture(savedFacture);

            // Enregistrement du paiement
            paiementRepository.save(paiement);

            savedCommande.setFacture(savedFacture);
            commandeRepository.save(savedCommande);

            // Suppression des lignes de panier
            lignesPanier.forEach(lignePanier -> lignePanierRepository.delete(lignePanier));

            panier.setLignesPanier(new ArrayList<>());
            panierRepository.save(panier);

            // Envoyer l'email de confirmation de commande
            List<String> articles = lignesCommande.stream()
                    .map(lc -> lc.getQuantite() + " x " + lc.getInstrument().getNom())
                    .collect(Collectors.toList());

            emailService.sendOrderConfirmationEmail(client.getEmail(), client.getNom(), articles, montantHT,
                    montantTotal,
                    lignesCommande,
                    modePaiement.getNom());

            // Construction de l'URI pour la nouvelle commande créée
            URI linkToNewCommande = builder.pathSegment("api", "commandes", "{id}")
                    .buildAndExpand(savedCommande.getId()).toUri();

            return ResponseEntity.created(linkToNewCommande).body(savedCommande);
        } catch (RuntimeException e) {
            // Log the exception with stack trace
            e.printStackTrace();
            // Return a ResponseEntity with the error message
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An error occurred while processing the order");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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

    @DeleteMapping("/api/commandes/{id}")
    @Transactional
    public ResponseEntity<Void> deleteCommande(@PathVariable UUID id) {
        Optional<Commande> commandeOptional = commandeRepository.findById(id);
        if (commandeOptional.isPresent()) {
            Commande commande = commandeOptional.get();
            ligneCommandeRepository.deleteByCommande(commande);
            commandeRepository.delete(commande);
            logger.info("Commande supprimée : {}", commande);

            // Envoyer l'e-mail d'annulation
            try {
                emailAnnulationService.sendAnnulationEmail(commande);
            } catch (MessagingException e) {
                logger.error("Failed to send annulation email for commande : {}", commande, e);
            }

            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/api/commandes/{id}")
    public ResponseEntity<Commande> updateCommande(@PathVariable UUID id,
            @RequestBody Commande updateCommande) {
        Optional<Commande> commandeOptional = commandeRepository.findById(id);
        if (commandeOptional.isPresent()) {
            Commande commande = commandeOptional.get();

            if (commande.getStatut().equals("confirmé")) {
                commande.setStatut("en livraison");
                try {
                    emailLivraisonService.sendLivraisonConfirmationEmail(commande);
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }

            Commande updatedCommande = commandeRepository.save(commande);
            return ResponseEntity.ok(updatedCommande);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
