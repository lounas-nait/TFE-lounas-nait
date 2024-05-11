package eafcuccle.tfe.lounasnaitecommerce.repositories;

import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;
import java.util.List;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, UUID> {
    List<Instrument> findAll();

    List<Instrument> findByNomContainingIgnoreCase(String nom);

}
