package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Client;
import eafcuccle.tfe.lounasnaitecommerce.classes.Commande;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, UUID> {

    List<Commande> findByClient(Client client);

    Optional<Commande> findByClientId(UUID clientId);

}
