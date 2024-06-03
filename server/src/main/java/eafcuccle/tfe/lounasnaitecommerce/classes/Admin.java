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

    // Constructeurs, getters et setters

    public Admin() {
    }

    public Admin(String nom, String email, String auth0Id) {
        super(nom, email, auth0Id);
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

}
