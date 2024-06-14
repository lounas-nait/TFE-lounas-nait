package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {
    Optional<Client> findById(UUID id);

    Optional<Client> findByEmail(String email);

    Optional<Client> findByAuth0Id(String auth0Id);
}