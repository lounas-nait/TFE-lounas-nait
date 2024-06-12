package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Admin;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {
    Optional<Admin> findById(UUID id);

    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByAuth0Id(String auth0Id);
}