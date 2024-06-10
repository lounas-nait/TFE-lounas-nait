package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Categorie;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.Image;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.LigneCommandeRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.LignePanierRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.PanierRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.AvissRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.CategorieRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.ImageRepository;
import eafcuccle.tfe.lounasnaitecommerce.dto.InstrumentDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController

public class InstrumentController {

    private final InstrumentRepository instrumentRepository;
    private final CategorieRepository categorieRepository;
    private final ImageRepository imageRepository;
    private final PanierRepository panierRepository;
    private final AvissRepository avissRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final LignePanierRepository lignePanierRepository;

    private static final Logger logger = LoggerFactory.getLogger(InstrumentController.class);

    @Autowired
    public InstrumentController(InstrumentRepository instrumentRepository, CategorieRepository categorieRepository,
            ImageRepository imageRepository, PanierRepository panierRepository, AvissRepository avissRepository,
            LigneCommandeRepository ligneCommandeRepository,
            LignePanierRepository lignePanierRepository) {
        this.instrumentRepository = instrumentRepository;
        this.categorieRepository = categorieRepository;
        this.imageRepository = imageRepository;
        this.panierRepository = panierRepository;
        this.avissRepository = avissRepository;
        this.ligneCommandeRepository = ligneCommandeRepository;
        this.lignePanierRepository = lignePanierRepository;
    }

    @GetMapping("/api/instruments")
    public ResponseEntity<List<Instrument>> getAllInstruments(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String categorie) {
        List<Instrument> instruments;
        if (StringUtils.hasText(q)) {
            System.out.println(q);
            // Si un paramètre de recherche est fourni, filtrer les instruments par nom
            instruments = instrumentRepository.findByNomContainingIgnoreCase(q);
        } else if (categorie != null) {
            int categorieId = Integer.parseInt(categorie);
            // Si un paramètre de catégorie est fourni, filtrer les instruments par
            // catégorie
            instruments = instrumentRepository.findByCategorieId(categorieId);
            System.out.println(categorieId);
        } else {
            // Sinon, récupérer tous les instruments
            instruments = instrumentRepository.findAll();
        }
        return ResponseEntity.ok(instruments);
    }

    @PostMapping("/api/instruments/{id}")
    public ResponseEntity<Instrument> addInstrument(@PathVariable("id") String id,
            @RequestBody InstrumentDto instrumentDTO,
            UriComponentsBuilder builder) {
        Instrument instrument = new Instrument();
        instrument.setId(UUID.randomUUID());
        instrument.setNom(instrumentDTO.getNom());
        instrument.setMarque(instrumentDTO.getMarque());
        instrument.setDescription(instrumentDTO.getDescription());
        instrument.setPrixTVA(instrumentDTO.getPrixTVA());
        instrument.setPrixHorsTVA(instrumentDTO.getPrixHorsTVA());
        instrument.setQuantiteEnStock(instrumentDTO.getQuantiteEnStock());

        // Utiliser instrumentDTO.getCategorieId() pour obtenir la catégorie
        int categorieId = instrumentDTO.getCategorieId();
        Optional<Categorie> categorieOptional = categorieRepository.findById(categorieId);
        if (categorieOptional.isPresent()) {
            Categorie categorie = categorieOptional.get();
            instrument.setCategorie(categorie);
            instrument.setAvis(new ArrayList<>());

            // Enregistrer l'instrument dans la base de données
            Instrument savedInstrument = instrumentRepository.save(instrument);

            // Ajouter les images à l'instrument
            List<String> imageUrls = instrumentDTO.getImageUrls();
            List<Image> images = new ArrayList<>();
            for (String imageUrl : imageUrls) {
                Image image = new Image();
                image.setUrl(imageUrl);
                image.setInstrument(savedInstrument); // Associer l'image à l'instrument
                images.add(image);
            }

            // Enregistrer les images associées à l'instrument dans la base de données
            List<Image> savedImages = imageRepository.saveAll(images);

            // Mettre à jour la liste des images de l'instrument avec les images
            // enregistrées
            savedInstrument.setImages(savedImages);

            // Enregistrer à nouveau l'instrument avec les images associées dans la base de
            // données
            Instrument finalInstrument = instrumentRepository.save(savedInstrument);

            URI linkToNewInstrument = builder.pathSegment("api", "instruments", "{id}")
                    .build(finalInstrument.getId());
            return ResponseEntity.created(linkToNewInstrument).body(finalInstrument);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/instruments/{id}/images")
    public ResponseEntity<Image> addImageToInstrument(@PathVariable("id") String id,
            @RequestBody Image image, UriComponentsBuilder builder) {
        image.setId(UUID.randomUUID());
        UUID instrumentId = UUID.fromString(id);

        Optional<Instrument> instrumentOptional = instrumentRepository.findById(instrumentId);

        if (instrumentOptional.isPresent()) {

            Instrument instrument = instrumentOptional.get();
            image.setInstrument(instrument);
            Image savedImage = imageRepository.save(image);

            instrumentRepository.save(instrument);

            URI linkToNewImage = builder.pathSegment("api", "Images", "{id}")
                    .build(savedImage.getId());
            return ResponseEntity.created(linkToNewImage).body(savedImage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/instruments/{id}")
    @Transactional
    public ResponseEntity<Void> deleteInstrument(@PathVariable UUID id) {
        Optional<Instrument> instrumentOptional = instrumentRepository.findById(id);
        if (instrumentOptional.isPresent()) {
            Instrument instrument = instrumentOptional.get();
            avissRepository.deleteByInstrument(instrument);
            imageRepository.deleteByInstrument(instrument);
            ligneCommandeRepository.deleteByInstrument(instrument);
            lignePanierRepository.deleteByInstrument(instrument);
            instrumentRepository.delete(instrument);

            logger.info("Instrument supprimée : {}", instrument);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/api/instruments/{id}")
    public ResponseEntity<Instrument> updateInstrument(@PathVariable UUID id,
            @RequestBody Instrument updateInstrument) {
        Optional<Instrument> instrumentOptional = instrumentRepository.findById(id);
        if (instrumentOptional.isPresent()) {
            Instrument instrument = instrumentOptional.get();
            instrument.setQuantiteEnStock(updateInstrument.getQuantiteEnStock());

            Instrument updatedInstrument = instrumentRepository.save(instrument);
            return ResponseEntity.ok(updatedInstrument);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
