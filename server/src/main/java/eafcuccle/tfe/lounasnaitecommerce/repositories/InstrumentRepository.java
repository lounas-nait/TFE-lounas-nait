package eafcuccle.tfe.lounasnaitecommerce.repositories;

import eafcuccle.tfe.lounasnaitecommerce.classes.Categorie;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.LignePanier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, UUID> {
    List<Instrument> findAll();

    List<Instrument> findByNomContainingIgnoreCase(String nom);

    List<Instrument> findByCategorieId(int categorieId);

    Optional<Instrument> findById(UUID id);

}
