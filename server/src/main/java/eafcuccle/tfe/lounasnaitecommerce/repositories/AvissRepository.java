package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Avis;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;

@Repository
public interface AvissRepository extends JpaRepository<Avis, UUID> {
    List<Avis> findAll();

    void deleteByInstrument(Instrument instrument);
}