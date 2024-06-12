package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Admin;
import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.classes.Commande;
import eafcuccle.tfe.lounasnaitecommerce.classes.Image;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;
import eafcuccle.tfe.lounasnaitecommerce.classes.Utilisateur;
import eafcuccle.tfe.lounasnaitecommerce.classes.LignePanier;
import eafcuccle.tfe.lounasnaitecommerce.repositories.AdminRepository;
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
import org.springframework.security.core.Authentication;
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
public class AdminController {

    private final AdminRepository adminRepository;

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping("/api/admins")
    public ResponseEntity<Admin> getAdmin(Authentication authentication) {
        if (authentication == null) {
            System.out.println("Authentication is null");
            return ResponseEntity.noContent().build(); // Retourner une réponse vide
        }
        System.out.println("Authentication is not null");
        String username = authentication.getName();
        System.out.println("Authenticated username: " + username);
        Optional<Admin> owner = adminRepository.findByAuth0Id(username);
        System.out.println("owner: " + owner.get());
        if (owner.isPresent()) {
            Admin admin = owner.get();

            return ResponseEntity.ok(admin);
        }
        return ResponseEntity.noContent().build(); // Retourner une réponse vide
    }

    @PostMapping("/api/admins")
    public Admin createAdmin(@RequestBody Admin admin) {

        admin.setId(UUID.randomUUID());

        adminRepository.save(admin);

        return admin;
    }

}
