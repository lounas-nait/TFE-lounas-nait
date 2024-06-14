package eafcuccle.tfe.lounasnaitecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import eafcuccle.tfe.lounasnaitecommerce.classes.Commande;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailLivraisonService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendLivraisonConfirmationEmail(Commande commande) throws MessagingException {

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String clientName = commande.getClient().getNom();
        String to = commande.getClient().getEmail();

        String subject = "Votre commande est en livraison";
        StringBuilder content = new StringBuilder();

        content.append("<p>Bonjour Monsieur/Madame ").append(clientName).append(",</p>");
        content.append("<p>Votre commande pour les articles suivants est maintenant en livraison :</p>");
        content.append("<ul>");
        commande.getLignesCommande().forEach(ligne -> {
            content.append("<li>").append(ligne.getInstrument().getNom()).append("</li>");
        });
        content.append("</ul>");
        content.append("<p>Vous recevrez bientôt vos articles.</p>");
        content.append("<p>Cordialement,</p>");
        content.append("<p>L'équipe Music Shop</p>");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content.toString(), true);

        emailSender.send(message);
    }
}
