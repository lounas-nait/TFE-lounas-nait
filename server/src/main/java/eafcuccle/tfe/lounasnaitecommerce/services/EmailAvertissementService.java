package eafcuccle.tfe.lounasnaitecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import eafcuccle.tfe.lounasnaitecommerce.classes.Client;

@Service
public class EmailAvertissementService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendAvertissementEmail(Client client) throws MessagingException {

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String clientName = client.getNom();
        String to = client.getEmail();

        String subject = "Avertissement concernant votre compte";
        StringBuilder content = new StringBuilder();

        content.append("<p>Bonjour Monsieur/Madame ").append(clientName).append(",</p>");
        content.append(
                "<p>Nous vous informons que votre avis a été supprimé en raison de son contenu inapproprié.</p>");
        content.append("<p>Veuillez faire attention à ce que vos commentaires respectent nos règles.</p>");
        content.append("<p>Si vous continuez à enfreindre nos règles, votre compte risque d'être bloqué.</p>");
        content.append("<p>Cordialement,</p>");
        content.append("<p>L'équipe Music Shop</p>");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content.toString(), true);

        emailSender.send(message);
    }
}
