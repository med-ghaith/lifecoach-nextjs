import { Text, Section } from "@react-email/components";
import { BaseEmail } from "./BaseEmail";

interface ClientBookingEmailProps {
  name: string;
  slotsText: string;
  packageName: string;
  price: number;
}

export default function ClientBookingEmail({
  name,
  slotsText,
  packageName,
  price,
}: ClientBookingEmailProps) {
  return (
    <BaseEmail>
      <Text style={{ fontSize: "20px", fontWeight: "bold", color: "#4B0082" }}>
        Réservation confirmée ✅
      </Text>

      <Text>Bonjour {name},</Text>

      <Text>Votre réservation a été confirmée avec succès.</Text>

      <Section style={{ marginTop: "15px" }}>
        <Text>
          <strong>Créneaux réservés :</strong>
          <br />
          {slotsText}
        </Text>

        <Text>
          <strong>Forfait :</strong> {packageName}
        </Text>

        <Text>
          <strong>Prix :</strong> {price}€
        </Text>
      </Section>

      <Text style={{ fontSize: "14px", color: "#666", marginTop: "30px" }}>
        Si vous avez des questions, vous pouvez répondre directement à cet
        email.
      </Text>
    </BaseEmail>
  );
}
