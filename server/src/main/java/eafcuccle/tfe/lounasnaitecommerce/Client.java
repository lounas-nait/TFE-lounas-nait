package eafcuccle.tfe.lounasnaitecommerce;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "client")
public class Client extends Utilisateur {
    @OneToOne(mappedBy = "client", cascade = CascadeType.ALL)
    private Panier panier;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Commande> commandes;

    // Constructeurs, getters et setters

    protected Client() {

    }

    public Client(String nom, String email, String motDePasse, String adresse) {
        super(nom, email, motDePasse, adresse);
    }

    public Panier getPanier() {
        return panier;
    }

    public void setPanier(Panier panier) {
        this.panier = panier;
    }

    public List<Commande> getCommandes() {
        return commandes;
    }

    public void setCommandes(List<Commande> commandes) {
        this.commandes = commandes;
    }
}
