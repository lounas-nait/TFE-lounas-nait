package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import eafcuccle.tfe.lounasnaitecommerce.classes.LignePanier;
import eafcuccle.tfe.lounasnaitecommerce.classes.Panier;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.LigneCommande;

@Repository
public interface LigneCommandeRepository extends JpaRepository<LigneCommande, UUID> {
    Optional<LigneCommande> findById(UUID id);

    void deleteByInstrument(Instrument instrument);
}