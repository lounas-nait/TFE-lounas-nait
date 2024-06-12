
package eafcuccle.tfe.lounasnaitecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import eafcuccle.tfe.lounasnaitecommerce.classes.Facture;
import eafcuccle.tfe.lounasnaitecommerce.classes.ModePaiement;
import eafcuccle.tfe.lounasnaitecommerce.classes.Paiement;
import eafcuccle.tfe.lounasnaitecommerce.repositories.FactureRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.ModePaiementRepository;
import eafcuccle.tfe.lounasnaitecommerce.repositories.PaiementRepository;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping
public class PaiementController {

    private final PaiementRepository paiementRepository;
    private final FactureRepository factureRepository;
    private final ModePaiementRepository modePaiementRepository;

    @Autowired
    public PaiementController(
            PaiementRepository paiementRepository,
            FactureRepository factureRepository,
            ModePaiementRepository modePaiementRepository) {
        this.paiementRepository = paiementRepository;
        this.factureRepository = factureRepository;
        this.modePaiementRepository = modePaiementRepository;
    }

    @GetMapping("/api/paiements")
    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    @GetMapping("/api/factures")
    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    @GetMapping("/api/modesPaiement")
    public List<ModePaiement> getAllmodesPaiement() {
        return modePaiementRepository.findAll();
    }

}