package eafcuccle.tfe.lounasnaitecommerce.classes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "admin")
public class Admin extends Utilisateur {
    /*
     * @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
     * 
     * @JsonBackReference
     * private List<Instrument> instruments;
     */
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("admin")
    private List<Commande> commandes;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Avis> avisList;

    // Constructeurs, getters et setters

    public Admin() {
    }

    public Admin(String nom, String email, String motDePasse, String adresse) {
        super(nom, email, motDePasse, adresse);
    }

    /*
     * public List<Instrument> getInstruments() {
     * return instruments;
     * }
     * 
     * public void setInstruments(List<Instrument> instruments) {
     * this.instruments = instruments;
     * }
     */
    public List<Commande> getCommandes() {
        return commandes;
    }

    public void setCommandes(List<Commande> commandes) {
        this.commandes = commandes;
    }

    public List<Avis> getAvisList() {
        return avisList;
    }

    public void setAvisList(List<Avis> avisList) {
        this.avisList = avisList;
    }
}
