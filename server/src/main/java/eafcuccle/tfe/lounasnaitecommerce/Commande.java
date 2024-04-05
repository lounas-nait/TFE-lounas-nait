package eafcuccle.tfe.lounasnaitecommerce;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "commande")
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "date_commande", nullable = false)
    private LocalDate dateCommande;

    @Column(name = "montant_total", nullable = false)
    private float montantTotal;

    @Column(name = "statut", nullable = false)
    private String statut;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<LigneCommande> lignesCommande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnoreProperties("commandes")
    private Client client;

    @OneToOne(mappedBy = "commande", cascade = CascadeType.ALL)
    private Facture facture;

    // Constructeurs, getters et setters

    protected Commande() {
    }

    public Commande(LocalDate dateCommande, float montantTotal, String statut, Client client) {
        this.dateCommande = dateCommande;
        this.montantTotal = montantTotal;
        this.statut = statut;
        this.client = client;
    }

    public UUID getId() {
        return id;
    }

    public LocalDate getDateCommande() {
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

    public void setDateCommande(LocalDate dateCommande) {
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

}