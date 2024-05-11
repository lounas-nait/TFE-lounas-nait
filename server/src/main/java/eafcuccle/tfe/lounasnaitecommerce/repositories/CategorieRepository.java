package eafcuccle.tfe.lounasnaitecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eafcuccle.tfe.lounasnaitecommerce.classes.Categorie;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Integer> {

}