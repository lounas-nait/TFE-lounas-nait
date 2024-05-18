package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.classes.Image;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;
import eafcuccle.tfe.lounasnaitecommerce.classes.Utilisateur;
import eafcuccle.tfe.lounasnaitecommerce.classes.LignePanier;

import eafcuccle.tfe.lounasnaitecommerce.repositories.ClientRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.PanierRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.UtilisateurRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.LignePanierRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
public class ClientController {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final PanierRepository panierRepository;
    private final LignePanierRepository lignePanierRepository;
    private final InstrumentRepository instrumentRepository;

    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);

    @Autowired
    public ClientController(ClientRepository clientRepository, PanierRepository panierRepository,
            UtilisateurRepository utilisateurRepository, LignePanierRepository lignePanierRepository,
            InstrumentRepository instrumentRepository) {
        this.clientRepository = clientRepository;
        this.panierRepository = panierRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.lignePanierRepository = lignePanierRepository;
        this.instrumentRepository = instrumentRepository;
    }

    @GetMapping("/api/clients")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @PostMapping("/api/clients")
    public Client createClientWithPanier(@RequestBody Client client) {

        UUID panierId = UUID.randomUUID();

        Panier panier = new Panier();
        panier.setId(panierId);

        client.setId(UUID.randomUUID());

        client.setPanier(panier);
        panier.setClient(client);

        clientRepository.save(client);

        return client;
    }

}
