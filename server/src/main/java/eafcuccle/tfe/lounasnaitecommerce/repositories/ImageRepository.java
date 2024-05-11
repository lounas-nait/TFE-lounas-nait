package eafcuccle.tfe.lounasnaitecommerce.repositories;

import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, UUID> {
    List<Image> findAll();
}
