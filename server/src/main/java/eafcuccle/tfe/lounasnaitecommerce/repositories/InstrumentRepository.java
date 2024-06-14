package eafcuccle.tfe.lounasnaitecommerce.repositories;

import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, UUID> {
    List<Instrument> findAll();

    List<Instrument> findByNomContainingIgnoreCase(String nom);

    List<Instrument> findByCategorieId(int categorieId);

    Optional<Instrument> findById(UUID id);

    Page<Instrument> findAll(Pageable pageable);

    Page<Instrument> findByNomContainingIgnoreCase(String nom, Pageable pageable);

    Page<Instrument> findByCategorieId(int categorieId, Pageable pageable);
}
