package eafcuccle.tfe.lounasnaitecommerce.classes;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "commande")
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "date_commande", nullable = false)
    private String dateCommande;

    @Column(name = "montant_total", nullable = false)
    private float montantTotal;

    @Column(name = "statut", nullable = false)
    private String statut;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<LigneCommande> lignesCommande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonBackReference
    private Client client;

    @OneToOne(mappedBy = "commande", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Facture facture;

    // Constructeurs, getters et setters

    protected Commande() {
    }

    public Commande(String dateCommande, float montantTotal, String statut, Client client) {
        this.dateCommande = dateCommande;
        this.montantTotal = montantTotal;
        this.statut = statut;
        this.client = client;
    }

    public UUID getId() {
        return id;
    }

    public String getDateCommande() {
        return dateCommande;
    }

    public float getMontantTotal() {
        return montantTotal;
    }

    public String getStatut() {
        return statut;
    }

    public Client getClient() {
        return client;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setDateCommande(String dateCommande) {
        this.dateCommande = dateCommande;
    }

    public void setMontantTotal(float montantTotal) {
        this.montantTotal = montantTotal;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public List<LigneCommande> getLignesCommande() {
        return lignesCommande;
    }

    public void setLignesCommande(List<LigneCommande> lignesCommande) {
        this.lignesCommande = lignesCommande;
    }

    public Facture getFacture() {
        return facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
    }

}