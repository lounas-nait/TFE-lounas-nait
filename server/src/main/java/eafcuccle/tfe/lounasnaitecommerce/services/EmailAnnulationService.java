package eafcuccle.tfe.lounasnaitecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import eafcuccle.tfe.lounasnaitecommerce.classes.Commande;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailAnnulationService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendAnnulationEmail(Commande commande) throws MessagingException {

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String clientName = commande.getClient().getNom();
        String to = commande.getClient().getEmail();

        String subject = "Votre commande a été annulée";
        StringBuilder content = new StringBuilder();

        content.append("<p>Bonjour Monsieur/Madame ").append(clientName).append(",</p>");
        content.append(
                "<p>Nous sommes désolés de vous informer que votre commande pour les articles suivants a été annulée :</p>");
        content.append("<ul>");
        commande.getLignesCommande().forEach(ligne -> {
            content.append("<li>").append(ligne.getInstrument().getNom()).append("</li>");
        });
        content.append("</ul>");
        content.append(
                "<p>Vous serez remboursé dans les jours à venir. Pour plus de détails, veuillez nous contacter.</p>");
        content.append("<p>Cordialement,</p>");
        content.append("<p>L'équipe Music Shop</p>");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content.toString(), true);

        emailSender.send(message);
    }
}
