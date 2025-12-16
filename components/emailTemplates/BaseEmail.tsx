import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
} from "@react-email/components";

interface BaseEmailProps {
  children: React.ReactNode;
}

export function BaseEmail({ children }: BaseEmailProps) {
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
          {children}
        </Container>
      </Body>
    </Html>
  );
}
