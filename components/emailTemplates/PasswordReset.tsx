import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Hr,
  Button,
} from "@react-email/components";

interface PasswordResetSuccessEmailProps {
  loginUrl: string;
}

export function PasswordResetSuccessEmail({
  loginUrl,
}: PasswordResetSuccessEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f5f5f5", margin: 0, padding: 0 }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "40px auto",
          }}
        >
          <Text
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#4B0082",
              marginBottom: "10px",
            }}
          >
            Mot de passe réinitialisé avec succès
          </Text>

          <Section>
            <Text>Bonjour,</Text>
            <Text style={{ marginTop: "10px" }}>
              Votre mot de passe a été réinitialisé avec succès.
            </Text>
            <Text style={{ marginTop: "10px" }}>
              Vous pouvez maintenant vous connecter à votre compte avec votre
              nouveau mot de passe.
            </Text>
          </Section>

          <Button
            style={{
              backgroundColor: "#4B0082",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block",
              fontWeight: "bold",
              padding: "12px 20px",
              marginTop: "20px",
            }}
            href={loginUrl}
          >
            Se connecter
          </Button>

          <Hr style={{ margin: "20px 0", borderColor: "#ddd" }} />

          <Text style={{ fontSize: "14px", color: "#666" }}>
            Si vous n'avez pas demandé cette modification, contactez
            immédiatement le support.
          </Text>
          <Text style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Ce message a été envoyé depuis votre application.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
