// src/emails/consultation-request.tsx
// Preview: npm run email
// Usage: render this to HTML and use as Formspree template body,
//        or pass to Resend/Nodemailer when you add a backend.

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

interface ConsultationEmailProps {
  name:        string;
  email:       string;
  company?:    string;
  phone?:      string;
  projectType: string;
  description: string;
  budget?:     string;
  timeline?:   string;
  goals?:      string;
  submittedAt?: string;
}

// ─── Preview data (shown in React Email dev server) ───────────────────────────

ConsultationRequestEmail.PreviewProps = {
  name:        "Jane Smith",
  email:       "jane@example.com",
  company:     "Acme Corp",
  phone:       "+1 (555) 000-0000",
  projectType: "Cloud architecture",
  description: "We need to migrate our on-prem infrastructure to AWS with zero downtime.",
  budget:      "$15k – $50k",
  timeline:    "Within 1 month",
  goals:       "Full cloud migration, CI/CD pipeline, and observability stack.",
  submittedAt: new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }),
} satisfies ConsultationEmailProps;

// ─── Styles ───────────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily:      "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin:          "0 auto",
  padding:         "0",
  maxWidth:        "560px",
  borderRadius:    "12px",
  overflow:        "hidden",
};

const header: React.CSSProperties = {
  backgroundColor: "#57c4dc",
  padding:         "24px 32px",
};

const headerTitle: React.CSSProperties = {
  color:      "#ffffff",
  fontSize:   "20px",
  fontWeight: "700",
  margin:     "0",
};

const headerSub: React.CSSProperties = {
  color:      "rgba(255,255,255,0.85)",
  fontSize:   "13px",
  margin:     "4px 0 0",
};

const body: React.CSSProperties = {
  padding: "24px 32px",
};

const sectionLabel: React.CSSProperties = {
  fontSize:      "11px",
  fontWeight:    "600",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color:         "#71717a",
  margin:        "0 0 8px",
};

const fieldRow: React.CSSProperties = {
  padding:         "10px 0",
  borderBottom:    "1px solid #f1f1f1",
};

const fieldLabel: React.CSSProperties = {
  fontSize:   "12px",
  color:      "#71717a",
  fontWeight: "500",
  margin:     "0 0 2px",
};

const fieldValue: React.CSSProperties = {
  fontSize: "14px",
  color:    "#18181b",
  margin:   "0",
};

const descBox: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  borderLeft:      "3px solid #57c4dc",
  padding:         "12px 16px",
  borderRadius:    "0 8px 8px 0",
  margin:          "0",
  fontSize:        "14px",
  color:           "#18181b",
  lineHeight:      "1.6",
};

const pillRow: React.CSSProperties = {
  display: "flex",
  gap:     "8px",
  margin:  "0",
};

const pill: React.CSSProperties = {
  backgroundColor: "#f0fdfe",
  border:          "1px solid #a5f0f9",
  borderRadius:    "999px",
  padding:         "4px 12px",
  fontSize:        "12px",
  color:           "#0e7490",
  fontWeight:      "500",
};

const replyBtn: React.CSSProperties = {
  display:         "inline-block",
  backgroundColor: "#57c4dc",
  color:           "#ffffff",
  padding:         "10px 20px",
  borderRadius:    "8px",
  fontSize:        "14px",
  fontWeight:      "600",
  textDecoration:  "none",
  margin:          "0",
};

const footer: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  padding:         "16px 32px",
  borderTop:       "1px solid #f1f1f1",
};

const footerText: React.CSSProperties = {
  fontSize: "11px",
  color:    "#a1a1aa",
  margin:   "0",
};

// ─── Template ─────────────────────────────────────────────────────────────────

export default function ConsultationRequestEmail({
  name,
  email,
  company,
  phone,
  projectType,
  description,
  budget,
  timeline,
  goals,
  submittedAt,
}: ConsultationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New consultation request from {name}{company ? ` at ${company}` : ""}</Preview>

      <Body style={main}>
        <Container style={container}>

          {/* ── Header ── */}
          <Section style={header}>
            <Text style={headerTitle}>New Consultation Request</Text>
            <Text style={headerSub}>
              Submitted via williamjwhite.me{submittedAt ? ` · ${submittedAt}` : ""}
            </Text>
          </Section>

          <Section style={body}>

            {/* ── Contact ── */}
            <Text style={sectionLabel}>Contact</Text>

            <Row style={fieldRow}>
              <Column>
                <Text style={fieldLabel}>Name</Text>
                <Text style={fieldValue}>{name}</Text>
              </Column>
            </Row>

            <Row style={fieldRow}>
              <Column>
                <Text style={fieldLabel}>Email</Text>
                <Text style={fieldValue}>
                  <Link href={`mailto:${email}`} style={{ color: "#57c4dc" }}>{email}</Link>
                </Text>
              </Column>
            </Row>

            {(company || phone) && (
              <Row style={fieldRow}>
                {company && (
                  <Column>
                    <Text style={fieldLabel}>Company</Text>
                    <Text style={fieldValue}>{company}</Text>
                  </Column>
                )}
                {phone && (
                  <Column>
                    <Text style={fieldLabel}>Phone</Text>
                    <Text style={fieldValue}>{phone}</Text>
                  </Column>
                )}
              </Row>
            )}

            <Hr style={{ margin: "20px 0", borderColor: "#f1f1f1" }} />

            {/* ── Project ── */}
            <Text style={sectionLabel}>Project</Text>

            <Row style={{ ...fieldRow, paddingBottom: "14px" }}>
              <Column>
                <Text style={fieldLabel}>Type of engagement</Text>
                <Text style={{ ...pillRow, display: "block" }}>
                  <span style={pill}>{projectType}</span>
                </Text>
              </Column>
            </Row>

            <Row style={{ ...fieldRow, paddingBottom: "14px" }}>
              <Column>
                <Text style={fieldLabel}>Description</Text>
                <Text style={descBox}>{description}</Text>
              </Column>
            </Row>

            {goals && (
              <Row style={{ ...fieldRow, paddingBottom: "14px" }}>
                <Column>
                  <Text style={fieldLabel}>Key goals / outcomes</Text>
                  <Text style={descBox}>{goals}</Text>
                </Column>
              </Row>
            )}

            <Hr style={{ margin: "20px 0", borderColor: "#f1f1f1" }} />

            {/* ── Scope ── */}
            {(budget || timeline) && (
              <>
                <Text style={sectionLabel}>Scope</Text>
                <Row style={fieldRow}>
                  {budget && (
                    <Column>
                      <Text style={fieldLabel}>Budget</Text>
                      <Text style={fieldValue}>{budget}</Text>
                    </Column>
                  )}
                  {timeline && (
                    <Column>
                      <Text style={fieldLabel}>Timeline</Text>
                      <Text style={fieldValue}>{timeline}</Text>
                    </Column>
                  )}
                </Row>
                <Hr style={{ margin: "20px 0", borderColor: "#f1f1f1" }} />
              </>
            )}

            {/* ── Reply CTA ── */}
            <Section style={{ textAlign: "center", padding: "8px 0 4px" }}>
              <Link href={`mailto:${email}?subject=Re: Your consultation request`} style={replyBtn}>
                Reply to {name.split(" ")[0]}
              </Link>
            </Section>

          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footerText}>
              williamjwhite.me · This email was generated automatically from a form submission.
              Reply directly to respond to {name}.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
