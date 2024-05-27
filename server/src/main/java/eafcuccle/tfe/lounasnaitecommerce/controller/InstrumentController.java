package eafcuccle.tfe.lounasnaitecommerce.controller;

import eafcuccle.tfe.lounasnaitecommerce.classes.Categorie;
import eafcuccle.tfe.lounasnaitecommerce.classes.Instrument;
import eafcuccle.tfe.lounasnaitecommerce.classes.Image;
import eafcuccle.tfe.lounasnaitecommerce.repositories.InstrumentRepository;
import jakarta.annotation.security.PermitAll;
import eafcuccle.tfe.lounasnaitecommerce.repositories.CategorieRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.ImageRepository;
import eafcuccle.tfe.lounasnaitecommerce.dto.InstrumentDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    private static final Logger logger = LoggerFactory.getLogger(InstrumentController.class);

    @Autowired
    public InstrumentController(InstrumentRepository instrumentRepository, CategorieRepository categorieRepository,
            ImageRepository imageRepository) {
        this.instrumentRepository = instrumentRepository;
        this.categorieRepository = categorieRepository;
        this.imageRepository = imageRepository;
    }

    @GetMapping("/api/instruments")
    public ResponseEntity<List<Instrument>> getAllInstruments(@RequestParam(required = false) String q) {
        List<Instrument> instruments;
        if (StringUtils.hasText(q)) {
            // Si un paramètre de recherche est fourni, filtrer les instruments par nom
            instruments = instrumentRepository.findByNomContainingIgnoreCase(q);
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

}
