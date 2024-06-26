package eafcuccle.tfe.lounasnaitecommerce.classes;

import jakarta.persistence.*;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "facture")
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "montantHT", nullable = false)
    private float montantHT;

    @Column(name = "montantTVA", nullable = false)
    private float montantTVA;

    @OneToOne(mappedBy = "facture", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Paiement paiement;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    @JsonBackReference
    private Commande commande;

    public Facture() {
    }

    public Facture(float montantHT, float montantTVA, Paiement paiement) {
        this.montantHT = montantHT;
        this.montantTVA = montantTVA;
        this.paiement = paiement;
    }

    public UUID getId() {
        return id;
    }

    public float getMontantHT() {
        return montantHT;
    }

    public float getMontantTVA() {
        return montantTVA;
    }

    public Paiement getPaiement() {
        return paiement;
    }

    public void setPaiement(Paiement paiement) {
        this.paiement = paiement;
    }

    public Commande getCommande() {
        return commande;
    }

    public void setCommande(Commande commande) {
        this.commande = commande;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setMontantHT(float montantHT) {
        this.montantHT = montantHT;
    }

    public void setMontantTVA(float montantTVA) {
        this.montantTVA = montantTVA;
    }

}