package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Categorie;
import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.classes.Commande;
import eafcuccle.tfe.lounasnaitecommerce.classes.Facture;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.LigneCommande;
import eafcuccle.tfe.lounasnaitecommerce.classes.LignePanier;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;
import eafcuccle.tfe.lounasnaitecommerce.repositories.ClientRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.CommandeRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.FactureRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.LigneCommandeRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.LignePanierRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.PanierRepository;

import org.springframework.transaction.annotation.Transactional;

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
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController

public class CommandeController {

    private final ClientRepository clientRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final CommandeRepository commandeRepository;
    private final PanierRepository panierRepository;
    private final InstrumentRepository instrumentRepository;
    private final LignePanierRepository lignePanierRepository;
    private final FactureRepository factureRepository;

    private static final Logger logger = LoggerFactory.getLogger(PanierController.class);

    @Autowired
    public CommandeController(ClientRepository clientRepository,
            CommandeRepository commandeRepository,
            LigneCommandeRepository ligneCommandeRepository,
            InstrumentRepository instrumentRepository,
            PanierRepository panierRepository,
            LignePanierRepository lignePanierRepository,
            FactureRepository factureRepository) {
        this.clientRepository = clientRepository;
        this.ligneCommandeRepository = ligneCommandeRepository;
        this.commandeRepository = commandeRepository;
        this.instrumentRepository = instrumentRepository;
        this.panierRepository = panierRepository;
        this.lignePanierRepository = lignePanierRepository;
        this.factureRepository = factureRepository;
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
            UriComponentsBuilder builder) {
        // Définir l'ID de la commande
        commande.setId(UUID.randomUUID());
        System.out.println(idClient);
        UUID idClientUuid = UUID.fromString(idClient);

        // Récupérer le client à partir de l'ID
        Client client = clientRepository.findById(idClientUuid)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Ajouter le client à la commande
        commande.setClient(client);

        // Récupérer le panier du client
        Panier panier = panierRepository.findByClientId(idClientUuid)
                .orElseThrow(() -> new RuntimeException("Panier not found"));

        // Récupérer les lignes de panier
        List<LignePanier> lignesPanier = panier.getLignesPanier();

        // Vérification du nombre de lignes panier
        System.out.println("Nombre de lignes dans le panier: " + lignesPanier.size());

        // Convertir les lignes de panier en lignes de commande
        List<LigneCommande> lignesCommande = lignesPanier.stream()
                .map(lignePanier -> {
                    LigneCommande ligneCommande = new LigneCommande();
                    ligneCommande.setId(UUID.randomUUID());
                    ligneCommande.setCommande(commande);
                    ligneCommande.setInstrument(lignePanier.getInstrument());
                    ligneCommande.setQuantite(lignePanier.getQuantite());
                    ligneCommande.setPrixUnitaireHorsTVA(lignePanier.getInstrument().getPrixHorsTVA());
                    ligneCommande.setPrixUnitairePaye(lignePanier.getInstrument().getPrixTVA());

                    // Mettre à jour la quantité en stock de l'instrument
                    Instrument instrument = lignePanier.getInstrument();
                    instrument.setQuantiteEnStock(instrument.getQuantiteEnStock() - lignePanier.getQuantite());
                    return ligneCommande;
                })
                .collect(Collectors.toList());

        // Associer les lignes de commande à la commande
        commande.setLignesCommande(lignesCommande);

        // Calculer le montant HT
        Float montantHT = (float) lignesCommande.stream()
                .mapToDouble(ligneCommande -> ligneCommande.getPrixUnitaireHorsTVA() * ligneCommande.getQuantite())
                .sum();

        // Calculer le montant total
        Float montantTotal = (float) lignesCommande.stream()
                .mapToDouble(ligneCommande -> ligneCommande.getPrixUnitairePaye() * ligneCommande.getQuantite())
                .sum();

        // Calculer le montant de la TVA (on suppose que le montant total inclut la TVA)

        // Sauvegarder la commande
        Commande savedCommande = commandeRepository.save(commande);

        // Créer et sauvegarder la facture
        Facture facture = new Facture();
        facture.setId(UUID.randomUUID());
        facture.setMontantHT(montantHT);
        facture.setMontantTVA(montantTotal);
        facture.setCommande(savedCommande); // Associer la facture à la commande
        Facture savedFacture = factureRepository.save(facture);
        System.out.println("factureeee: " + savedFacture.getMontantTVA());
        // Mettre à jour la commande avec la facture sauvegardée
        savedCommande.setFacture(savedFacture);
        commandeRepository.save(savedCommande);
        System.out.println("commandeeeeee: " + savedCommande.getMontantTotal());
        // Supprimer les lignes de panier
        lignesPanier.forEach(lignePanier -> lignePanierRepository.delete(lignePanier));

        // Vider la liste des lignes de panier dans le panier
        panier.setLignesPanier(new ArrayList<>());
        panierRepository.save(panier); // Enregistrer les modifications du panier

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
