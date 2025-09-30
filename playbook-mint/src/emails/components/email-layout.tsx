import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Hr
} from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '12px',
  margin: '40px auto',
  maxWidth: '600px',
  padding: '0',
};

const header = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #f0f0f0',
  borderRadius: '12px 12px 0 0',
  padding: '24px',
};

const content = {
  padding: '32px',
};

const footer = {
  backgroundColor: '#f8f9fa',
  borderTop: '1px solid #f0f0f0',
  borderRadius: '0 0 12px 12px',
  padding: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const logo = {
  height: '32px',
  width: 'auto',
};

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://thethriftypigeon.com/logo.png"
              alt="The Thrifty Pigeon"
              style={logo}
            />
          </Section>
          
          {/* Main Content */}
          <Section style={content}>
            {children}
          </Section>
          
          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>The Thrifty Pigeon</strong>
              <br />
              Money advice that doesn't make you feel broke or stupid.
            </Text>
            <Hr style={{ border: 'none', borderTop: '1px solid #e6e6e6', margin: '16px 0' }} />
            <Text style={footerText}>
              <Link href="https://thethriftypigeon.com" style={{ color: '#0066cc', textDecoration: 'none' }}>
                Website
              </Link>
              {' • '}
              <Link href="https://twitter.com/thethriftypigeon" style={{ color: '#0066cc', textDecoration: 'none' }}>
                Twitter
              </Link>
              {' • '}
              <Link href="{{unsubscribe}}" style={{ color: '#666666', textDecoration: 'none' }}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}