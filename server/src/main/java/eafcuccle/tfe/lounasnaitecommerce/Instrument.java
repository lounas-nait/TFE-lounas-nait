package eafcuccle.tfe.lounasnaitecommerce;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "instrument")
public class Instrument {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "marque")
    private String marque;

    @Column(name = "description")
    private String description;

    @Column(name = "prix_hors_tva")
    private float prixHorsTVA;

    @Column(name = "prix_tva")
    private float prixTVA;

    @Column(name = "quantite_en_stock")
    private int quantiteEnStock;

    @OneToMany(mappedBy = "instrument", cascade = CascadeType.ALL)
    private List<Image> images;

    @OneToMany(mappedBy = "instrument", cascade = CascadeType.ALL)
    private List<Avis> avis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categorie categorie;

    // Constructeurs, getters et setters

    public Instrument() {
    }

    public Instrument(String nom, String marque, String description, float prixHorsTVA, float prixTVA,
            int quantiteEnStock) {
        this.nom = nom;
        this.marque = marque;
        this.description = description;
        this.prixHorsTVA = prixHorsTVA;
        this.prixTVA = prixTVA;
        this.quantiteEnStock = quantiteEnStock;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getMarque() {
        return marque;
    }

    public void setMarque(String marque) {
        this.marque = marque;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public float getPrixHorsTVA() {
        return prixHorsTVA;
    }

    public void setPrixHorsTVA(float prixHorsTVA) {
        this.prixHorsTVA = prixHorsTVA;
    }

    public float getPrixTVA() {
        return prixTVA;
    }

    public void setPrixTVA(float prixTVA) {
        this.prixTVA = prixTVA;
    }

    public int getQuantiteEnStock() {
        return quantiteEnStock;
    }

    public void setQuantiteEnStock(int quantiteEnStock) {
        this.quantiteEnStock = quantiteEnStock;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<Avis> getAvis() {
        return avis;
    }

    public void setAvis(List<Avis> avis) {
        this.avis = avis;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }
}
