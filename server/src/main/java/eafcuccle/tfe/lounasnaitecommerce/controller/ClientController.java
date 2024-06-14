package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;

import eafcuccle.tfe.lounasnaitecommerce.repositories.ClientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
public class ClientController {

    private final ClientRepository clientRepository;

    @Autowired
    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @GetMapping("/api/clients")
    public ResponseEntity<?> getClients(Authentication authentication) {
        if (authentication == null) {
            // Si l'authentification est nulle, renvoyer tous les clients
            List<Client> allClients = clientRepository.findAll();
            System.out.println("Authentication is null, returning all clients.");
            return ResponseEntity.ok(allClients);
        }
        String username = authentication.getName();
        Optional<Client> owner = clientRepository.findByAuth0Id(username);

        if (owner.isPresent()) {
            Client client = owner.get();
            return ResponseEntity.ok(client);
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/clients/{clientId}")
    public ResponseEntity<?> getClientById(@PathVariable("clientId") String clientId, Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        UUID idClient;
        try {
            idClient = UUID.fromString(clientId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid UUID format");
        }

        Optional<Client> client = clientRepository.findById(idClient);

        if (client.isPresent()) {
            return ResponseEntity.ok(client.get()); // Retourner le client avec succès
        } else {
            return ResponseEntity.notFound().build(); // Retourner une réponse 404 si le client n'est pas trouvé
        }
    }

    @PostMapping("/api/clients")
    public Client createClientWithPanier(@RequestBody Client client) {

        UUID panierId = UUID.randomUUID();

        Panier panier = new Panier();

        panier.setId(panierId);

        client.setId(UUID.randomUUID());

        client.setPanier(panier);
        client.setCommandes(new ArrayList<>());

        panier.setClient(client);

        clientRepository.save(client);

        return client;
    }

}
