import * as React from "react";
import { Html, Head, Body, Container, Text, Section, Hr, Button } from "@react-email/components";

interface OwnerEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
  dashboardUrl:string;
}

export function OwnerEmail({
  name,
  email,
  phone,
  message,
  dashboardUrl,
}: OwnerEmailProps) {
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
            Nouveau message de contact
          </Text>

          <Section>
            <Text>
              <strong>Nom :</strong> {name}
            </Text>
            <Text>
              <strong>Email :</strong> {email}
            </Text>
            <Text>
              <strong>Téléphone :</strong> {phone || "N/A"}
            </Text>
            <Text>
              <strong>Message :</strong>
            </Text>
            <Text>{message}</Text>
          </Section>

          {dashboardUrl && (
            <Button
              style={{
                backgroundColor: "#4B0082",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: "bold",
                padding: "12px 20px", // vertical 12px, horizontal 20px
              }}
              href={dashboardUrl}
            >
              Accéder à votre espace
            </Button>
          )}
          <Hr style={{ margin: "20px 0", borderColor: "#ddd" }} />

          <Text style={{ fontSize: "14px", color: "#666" }}>
            Ce message a été envoyé depuis le formulaire de contact du site.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
