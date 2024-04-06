package eafcuccle.tfe.lounasnaitecommerce;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "ligne_panier")
public class LignePanier {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "quantite")
    private int quantite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instrument_id", nullable = false)
    private Instrument instrument;

    // Constructeurs, getters et setters

    protected LignePanier() {
    }

    public LignePanier(int quantite, Instrument instrument) {
        this.quantite = quantite;
        this.instrument = instrument;
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

    public Instrument getInstrument() {
        return instrument;
    }

    public void setInstrument(Instrument instrument) {
        this.instrument = instrument;
    }
}
