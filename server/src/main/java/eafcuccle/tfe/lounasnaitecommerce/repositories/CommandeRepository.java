package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Commande;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, UUID> {

}
