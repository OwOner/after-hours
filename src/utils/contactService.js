import { SITE_CONFIG } from '../data/portfolioData.js';

/**
 * Builds a properly encoded mailto: URL from the visitor's form inputs.
 * If no verified contactEmail is configured yet, leaves the recipient blank
 * so the visitor's default email client still opens with the prefilled
 * subject and message body.
 */
export function buildMailtoHref({ name, email, subject, message }) {
  const recipient = SITE_CONFIG.contactEmail ? SITE_CONFIG.contactEmail.trim() : '';
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedSubject =
    (subject || '').trim() ||
    `Portfolio Inquiry from ${trimmedName || 'Visitor'} — AFTERHOURS`;

  const bodyLines = [
    trimmedName ? `Name: ${trimmedName}` : null,
    trimmedEmail ? `Reply-To Email: ${trimmedEmail}` : null,
    '',
    'Message:',
    (message || '').trim(),
  ].filter((line) => line !== null);

  const encodedSubject = encodeURIComponent(trimmedSubject);
  const encodedBody = encodeURIComponent(bodyLines.join('\r\n'));

  return `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Contact Submission Adapter
 *
 * Currently configured for Option 3: Direct mailto fallback.
 * Structured so a Web3Forms, Formspree, or custom backend endpoint can be
 * enabled later simply by setting `VITE_CONTACT_ENDPOINT` in `.env` without
 * redesigning the ContactModal component.
 */
export async function submitContactInquiry(formData) {
  if (SITE_CONFIG.contactEndpoint) {
    const response = await fetch(SITE_CONFIG.contactEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Submission failed with status ${response.status}`);
    }

    return { mode: 'endpoint', ok: true };
  }

  const mailtoHref = buildMailtoHref(formData);
  window.location.href = mailtoHref;
  return { mode: 'mailto', mailtoHref };
}

