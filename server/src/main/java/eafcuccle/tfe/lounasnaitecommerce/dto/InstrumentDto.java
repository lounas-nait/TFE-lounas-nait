package eafcuccle.tfe.lounasnaitecommerce.dto;

import java.util.List;

public class InstrumentDto {
    private String nom;
    private String marque;
    private String description;
    private float prixTVA;
    private float prixHorsTVA;
    private int quantiteEnStock;
    private List<String> imageUrls;
    private int categorieId;

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

    public float getPrixTVA() {
        return prixTVA;
    }

    public void setPrixTVA(float prixTVA) {
        this.prixTVA = prixTVA;
    }

    public float getPrixHorsTVA() {
        return prixHorsTVA;
    }

    public void setPrixHorsTVA(float prixHorsTVA) {
        this.prixHorsTVA = prixHorsTVA;
    }

    public int getQuantiteEnStock() {
        return quantiteEnStock;
    }

    public void setQuantiteEnStock(int quantiteEnStock) {
        this.quantiteEnStock = quantiteEnStock;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public int getCategorieId() {
        return categorieId;
    }

    public void setCategorieId(int categorieId) {
        this.categorieId = categorieId;
    }

    // Getters and Setters
}
