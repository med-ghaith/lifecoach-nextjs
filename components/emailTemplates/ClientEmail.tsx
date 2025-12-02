import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Section,
} from "@react-email/components";

interface ClientEmailProps {
  name: string;
  dashboardUrl?: string;
}

export function ClientEmail({ name, dashboardUrl }: ClientEmailProps) {
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
            Bonjour {name} !
          </Text>

          <Text
            style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}
          >
            Merci beaucoup pour votre message et pour votre intérêt. Je serai
            ravie de vous accompagner en consultation miraculeuse pour
            transformer votre avenir.
          </Text>
          <Section>
            <Text
              style={{ fontSize: "14px", color: "#666", marginTop: "20px" }}
            >
              Si vous avez des questions, n'hésitez pas à répondre à cet email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
