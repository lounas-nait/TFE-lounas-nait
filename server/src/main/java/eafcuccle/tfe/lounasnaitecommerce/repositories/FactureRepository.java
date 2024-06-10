package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Facture;

@Repository
public interface FactureRepository extends JpaRepository<Facture, UUID> {

}