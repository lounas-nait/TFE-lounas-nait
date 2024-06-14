package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Admin;

import eafcuccle.tfe.lounasnaitecommerce.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.Optional;

@RestController
public class AdminController {

    private final AdminRepository adminRepository;

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
