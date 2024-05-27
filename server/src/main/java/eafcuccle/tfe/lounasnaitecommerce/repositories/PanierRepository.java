package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;

@Repository
public interface PanierRepository extends JpaRepository<Panier, UUID> {
    Panier findByClient(Client client);

    Optional<Panier> findByClientId(UUID clientId);
}