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

interface ForgotPasswordEmailProps {
  resetUrl: string;
}

export function ForgotPasswordEmail({
  resetUrl,
}: ForgotPasswordEmailProps) {
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
            Réinitialisation du mot de passe
          </Text>

          <Section>
            <Text>Bonjour </Text>
            <Text style={{ marginTop: "10px" }}>
              Nous avons reçu une demande pour réinitialiser votre mot de passe.
            </Text>
            <Text style={{ marginTop: "10px" }}>
              Cliquez sur le bouton ci-dessous pour définir un nouveau mot de
              passe :
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
            href={resetUrl}
          >
            Réinitialiser mon mot de passe
          </Button>

          <Hr style={{ margin: "20px 0", borderColor: "#ddd" }} />

          <Text style={{ fontSize: "14px", color: "#666" }}>
            Si vous n'avez pas demandé cette réinitialisation, vous pouvez
            ignorer ce message.
          </Text>
          <Text style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Ce message a été envoyé depuis votre application.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
