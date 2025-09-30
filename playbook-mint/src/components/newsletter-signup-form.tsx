'use client';

import { useState } from 'react';

export function NewsletterSignupForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({
        type: 'error',
        message: 'Please enter your email address.'
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          source: 'website',
          gdprConsent: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: data.alreadySubscribed 
            ? "You're already subscribed! Thanks for being part of the community." 
            : "🎉 Welcome to The Thrifty Pigeon! Check your email for a welcome message."
        });
        
        // Reset form on success (unless already subscribed)
        if (!data.alreadySubscribed) {
          setEmail('');
          setFirstName('');
        }
      } else {
        // Handle validation errors
        if (data.errors && data.errors.length > 0) {
          setStatus({
            type: 'error',
            message: data.errors[0].message
          });
        } else {
          setStatus({
            type: 'error',
            message: data.message || 'Something went wrong. Please try again.'
          });
        }
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-8 shadow-soft">
      {/* Success/Error Messages */}
      {status.type && (
        <div className={`mb-6 rounded-2xl p-4 ${
          status.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="text-sm font-medium">
            {status.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field (optional) */}
        <div>
          <label htmlFor="firstName" className="sr-only">
            First name (optional)
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Your first name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-full border border-brand-100 bg-white px-4 py-3 text-base text-ink-900 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="flex-1 rounded-full border border-brand-100 bg-white px-4 py-3 text-base text-ink-900 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:bg-gray-50 disabled:text-gray-500"
          />
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </form>

      <p className="mt-4 text-xs text-ink-500">
        One email per week, no spam. Unsubscribe anytime with one click.
      </p>
    </div>
  );
}