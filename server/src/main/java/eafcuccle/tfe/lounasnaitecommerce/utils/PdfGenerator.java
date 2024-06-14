package eafcuccle.tfe.lounasnaitecommerce.utils;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import eafcuccle.tfe.lounasnaitecommerce.classes.LigneCommande;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;

public class PdfGenerator {

    public static void createInvoicePdf(String filePath, String clientName, List<String> articles,
            float montantHT, float montantTVA, List<LigneCommande> lignesCommande) throws IOException {

        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {

            // Titre
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 750);
            contentStream.showText("Facture pour votre commande chez Music Shop");
            contentStream.endText();

            // Client
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(60, 700);
            contentStream.showText("Nom: " + clientName);
            contentStream.endText();

            // Montant HT
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(250, 670);
            contentStream.showText("Montant HT: " + formatAmount(montantHT) + " EUR");
            contentStream.endText();

            // Montant TVA
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(250, 650);
            contentStream.showText("Montant TVA: " + formatAmount(montantTVA) + " EUR");
            contentStream.endText();

            // Articles
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(65, 600);
            contentStream.showText("Articles:");
            contentStream.endText();

            int yPosition = 590;

            // Lignes de commande détaillées
            yPosition -= 20;
            for (LigneCommande ligneCommande : lignesCommande) {
                contentStream.beginText();
                contentStream.newLineAtOffset(70, yPosition);
                contentStream.showText(ligneCommande.getQuantite() + " x " + ligneCommande.getInstrument().getNom() +
                        " : " + formatAmount(ligneCommande.getPrixUnitairePaye()) + " EUR");
                contentStream.endText();
                yPosition -= 20;
            }

            // Message de remerciement
            contentStream.setFont(PDType1Font.HELVETICA_OBLIQUE, 10);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 150);
            contentStream.showText("Music Shop vous remercie pour votre achat !");
            contentStream.endText();

        } catch (IOException e) {
            e.printStackTrace();
        }

        document.save(filePath);
        document.close();
    }

    private static String formatAmount(float amount) {
        DecimalFormat df = new DecimalFormat("#.##");
        return df.format(amount);
    }

}
