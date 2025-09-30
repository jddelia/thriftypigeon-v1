import React from 'react';
import {
  Text,
  Heading,
  Button,
  Section,
  Hr
} from '@react-email/components';
import { EmailLayout } from '../components/email-layout';

interface WelcomeEmailProps {
  firstName?: string;
  email: string;
}

const heading = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 16px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const button = {
  backgroundColor: '#0f172a',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  padding: '12px 24px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: 'auto',
};

const articleList = {
  margin: '0 0 24px 0',
  paddingLeft: '0',
};

const articleItem = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  margin: '0 0 12px 0',
  padding: '16px',
};

const articleTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 8px 0',
  textDecoration: 'none',
};

const articleDescription = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

export function WelcomeEmail({ firstName = 'there', email }: WelcomeEmailProps) {
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  return (
    <EmailLayout preview={`Welcome to The Thrifty Pigeon, ${displayName}! Here's what you need.`}>
      <Heading style={heading}>
        Welcome to The Thrifty Pigeon, {displayName}! 👋
      </Heading>

      <Text style={text}>
        You just joined thousands of people building wealth with practical systems that actually work.
      </Text>

      <Text style={text}>
        Whether you're saving your first $100 or your first $10,000, you deserve guides that treat you like an intelligent person who just needs practical steps—not lectures about coffee shop visits.
      </Text>

      <Text style={text}>
        <strong>Here's what to explore first:</strong>
      </Text>

      <Section style={articleList}>
        <Section style={articleItem}>
          <Text style={articleTitle}>
            Emergency Fund Complete Guide
          </Text>
          <Text style={articleDescription}>
            Step-by-step system for building emergency savings, whether you're starting with $25 or $2,500.
          </Text>
        </Section>

        <Section style={articleItem}>
          <Text style={articleTitle}>
            Budgeting for Beginners
          </Text>
          <Text style={articleDescription}>
            30-minute setup using the 3-bucket system that actually works for real people.
          </Text>
        </Section>

        <Section style={articleItem}>
          <Text style={articleTitle}>
            Save $200+ on Monthly Bills
          </Text>
          <Text style={articleDescription}>
            15 ways to cut expenses without changing your lifestyle or giving up things you enjoy.
          </Text>
        </Section>
      </Section>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button
          href="https://thethriftypigeon.com/articles"
          style={button}
        >
          Start Building Wealth Today
        </Button>
      </Section>

      <Hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />

      <Text style={text}>
        <strong>A quick note from me:</strong>
      </Text>

      <Text style={text}>
        I built The Thrifty Pigeon because I got tired of financial advice that either talked down to people or assumed they already had money to work with.
      </Text>

      <Text style={text}>
        Every article on this site gives you everything you need to succeed—no paywalls, no "sign up to read the rest." The playbooks ($5-$9) are just convenience tools with spreadsheets and templates ready to use.
      </Text>

      <Text style={text}>
        Questions? Just reply to this email. I read and respond to every message.
      </Text>

      <Text style={{ ...text, margin: '24px 0 0 0' }}>
        Talk soon,
        <br />
        <strong>The Thrifty Pigeon Team</strong>
      </Text>
    </EmailLayout>
  );
}