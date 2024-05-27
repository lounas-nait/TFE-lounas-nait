package eafcuccle.tfe.lounasnaitecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

import eafcuccle.tfe.lounasnaitecommerce.classes.Avis;
import eafcuccle.tfe.lounasnaitecommerce.classes.Categorie;
import eafcuccle.tfe.lounasnaitecommerce.classes.Image;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.repositories.AvissRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.CategorieRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.ImageRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping
public class CategorieController {

    private final CategorieRepository categorieRepository;
    private final AvissRepository avissRepository;
    private final ImageRepository imageRepository;

    @Autowired
    public CategorieController(
            CategorieRepository categorieRepository,
            AvissRepository avissRepository,
            ImageRepository imageRepository) {

        this.categorieRepository = categorieRepository;
        this.avissRepository = avissRepository;
        this.imageRepository = imageRepository;

    }

    @GetMapping("/api/categories")
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    @GetMapping("/api/avis")
    public List<Avis> getAllAvis() {
        return avissRepository.findAll();
    }

    @GetMapping("/api/images")
    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

}
