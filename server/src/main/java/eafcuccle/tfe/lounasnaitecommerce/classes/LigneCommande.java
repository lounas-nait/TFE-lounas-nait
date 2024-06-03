package eafcuccle.tfe.lounasnaitecommerce.classes;

import jakarta.persistence.*;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "ligne_commande")
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "quantite", nullable = false)
    private int quantite;

    @Column(name = "prix_unitaire_hors_tva", nullable = false)
    private float prixUnitaireHorsTVA;

    @Column(name = "prix_unitaire_paye", nullable = false)
    private float prixUnitairePaye;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instrument_id", nullable = false)
    @JsonIgnoreProperties("ligneCommande")
    private Instrument instrument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    @JsonBackReference
    private Commande commande;

    // Constructeurs, getters et setters

    public LigneCommande() {

    }

    public LigneCommande(int quantite, float prixUnitaireHorsTVA, float prixUnitairePaye) {
        this.quantite = quantite;
        this.prixUnitaireHorsTVA = prixUnitaireHorsTVA;
        this.prixUnitairePaye = prixUnitairePaye;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public int getQuantite() {
        return quantite;
    }

    public void setQuantite(int quantite) {
        this.quantite = quantite;
    }

    public float getPrixUnitaireHorsTVA() {
        return prixUnitaireHorsTVA;
    }

    public void setPrixUnitaireHorsTVA(float prixUnitaireHorsTVA) {
        this.prixUnitaireHorsTVA = prixUnitaireHorsTVA;
    }

    public float getPrixUnitairePaye() {
        return prixUnitairePaye;
    }

    public void setPrixUnitairePaye(float prixUnitairePaye) {
        this.prixUnitairePaye = prixUnitairePaye;
    }

    public Instrument getInstrument() {
        return instrument;
    }

    public void setInstrument(Instrument instrument) {
        this.instrument = instrument;
    }

    public Commande getCommande() {
        return commande;
    }

    public void setCommande(Commande commande) {
        this.commande = commande;
    }
}
