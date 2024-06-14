package eafcuccle.tfe.lounasnaitecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import eafcuccle.tfe.lounasnaitecommerce.classes.LigneCommande;
import eafcuccle.tfe.lounasnaitecommerce.utils.PdfGenerator;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.text.DecimalFormat;
import java.util.Base64;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendOrderConfirmationEmail(String to, String clientName, List<String> articles,
            float montantHT, float montantTVA, List<LigneCommande> lignesCommande)
            throws MessagingException, IOException {

        // Chemin où la facture PDF sera temporairement sauvegardée
        String invoiceFilePath = "src/main/resources/invoice.pdf";

        // Générer la facture PDF
        try {
            PdfGenerator.createInvoicePdf(invoiceFilePath, clientName, articles, montantHT, montantTVA, lignesCommande);
        } catch (Exception e) {
            e.printStackTrace();
        }

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String subject = "Confirmation de commande";
        StringBuilder content = new StringBuilder();

        // Charger l'image et l'encoder en base64
        ClassPathResource logo = new ClassPathResource("static/images/ms.png");
        byte[] logoBytes = Files.readAllBytes(logo.getFile().toPath());
        String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);
        String logoSrc = "data:image/png;base64," + logoBase64;

        content.append("<div style='text-align: center;'><img src='").append(logoSrc)
                .append("' alt='Logo' style='width: 200px; height: auto;'/></div>");
        content.append("<p>Bonjour Monsieur/Madame ").append(clientName).append(",</p>");
        content.append("<p>Music Shop vous remercie pour votre confiance.</p>");
        content.append(
                "<p>Nous avons bien reçu votre règlement et votre commande est validée pour les articles suivants :</p>");
        content.append("<ul>");
        for (String article : articles) {
            content.append("<li>").append(article).append("</li>");
        }
        content.append("</ul>");

        content.append(
                "<p>Nous vous tiendrons informé dès que votre commande sera en livraison.</p>");
        content.append("<p>Vous trouverez votre facture en pièce jointe.</p>");
        content.append("<p>Cordialement,</p>");
        content.append("<p>L'équipe Music Shop</p>");
        content.append(
                "<p style='font-size: 12px; color: gray;'>Si vous ne souhaitez plus recevoir d'emails de notre part, veuillez <a href='#'>vous désabonner</a>.</p>");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content.toString(), true);

        // Attacher le PDF de la facture
        FileSystemResource file = new FileSystemResource(new File(invoiceFilePath));
        helper.addAttachment("Facture.pdf", file);

        emailSender.send(message);

        // Supprimer le fichier PDF temporaire après envoi
        File invoiceFile = new File(invoiceFilePath);
        if (invoiceFile.exists()) {
            invoiceFile.delete();
        }
    }

    private String formatAmount(float amount) {
        DecimalFormat df = new DecimalFormat("#.##");
        return df.format(amount);
    }
}