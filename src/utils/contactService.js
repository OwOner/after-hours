import { SITE_CONFIG } from '../data/portfolioData.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Resolves the configured Formspree endpoint from VITE_FORMSPREE_ENDPOINT.
 * Accepts either a full https://formspree.io/f/... URL or a raw Formspree form ID.
 * Returns an empty string if not configured.
 */
export function resolveFormspreeEndpoint(overrideEndpoint) {
  const raw =
    overrideEndpoint !== undefined
      ? String(overrideEndpoint).trim()
      : String(SITE_CONFIG.formspreeEndpoint || '').trim();

  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  // If user provided just the Formspree form hash ID (e.g. "xabcdefg")
  if (/^[a-zA-Z0-9_-]{6,32}$/.test(raw)) {
    return `https://formspree.io/f/${raw}`;
  }
  return raw;
}

/**
 * Validates all contact form fields including required fields, email format,
 * and the hidden honeypot spam protection field.
 */
export function validateContactForm({ name, email, subject, message, _gotcha }) {
  // 1. Honeypot spam protection
  if (_gotcha && String(_gotcha).trim() !== '') {
    return {
      valid: false,
      code: 'SPAM_DETECTED',
      error: 'Submission rejected by spam protection.',
    };
  }

  const trimmedName = String(name || '').trim();
  const trimmedEmail = String(email || '').trim();
  const trimmedSubject = String(subject || '').trim();
  const trimmedMessage = String(message || '').trim();

  // 2. Required fields check
  if (!trimmedName) {
    return {
      valid: false,
      code: 'MISSING_NAME',
      field: 'name',
      error: 'Please enter your name.',
    };
  }

  if (!trimmedEmail) {
    return {
      valid: false,
      code: 'MISSING_EMAIL',
      field: 'email',
      error: 'Please enter your email address.',
    };
  }

  // 3. Email format validation
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return {
      valid: false,
      code: 'INVALID_EMAIL',
      field: 'email',
      error: 'Please enter a valid email address (e.g., name@example.com).',
    };
  }

  if (!trimmedMessage) {
    return {
      valid: false,
      code: 'MISSING_MESSAGE',
      field: 'message',
      error: 'Please enter a message before sending.',
    };
  }

  return {
    valid: true,
    payload: {
      name: trimmedName,
      email: trimmedEmail,
      subject:
        trimmedSubject || `Portfolio Inquiry from ${trimmedName} — AFTERHOURS`,
      message: trimmedMessage,
      _gotcha: '',
    },
  };
}

/**
 * Submits the validated contact inquiry directly to Formspree via HTTP POST.
 * Throws descriptive errors for missing configuration, validation failure,
 * honeypot spam, or network/server errors.
 */
export async function submitContactInquiry(formData, options = {}) {
  const validation = validateContactForm(formData);
  if (!validation.valid) {
    const err = new Error(validation.error);
    err.code = validation.code;
    err.field = validation.field;
    throw err;
  }

  const endpoint = resolveFormspreeEndpoint(options.endpoint);
  if (!endpoint) {
    const err = new Error(
      'Form submission is not configured yet (VITE_FORMSPREE_ENDPOINT is not set). Please configure VITE_FORMSPREE_ENDPOINT in your environment variables, or copy the direct email address above.',
    );
    err.code = 'MISSING_CONFIG';
    throw err;
  }

  const fetchImpl = options.fetchImpl || fetch;
  let response;

  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(validation.payload),
    });
  } catch {
    const err = new Error(
      'Network error while sending your message. Please check your internet connection and try again.',
    );
    err.code = 'NETWORK_ERROR';
    throw err;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response body
  }

  if (!response.ok) {
    const formspreeError =
      Array.isArray(data?.errors) && data.errors.length > 0
        ? data.errors.map((e) => e.message).join(' ')
        : null;
    const err = new Error(
      formspreeError ||
        `Unable to send message (server responded with status ${response.status}). Please try again.`,
    );
    err.code = 'SERVER_ERROR';
    err.status = response.status;
    throw err;
  }

  return {
    ok: true,
    status: response.status,
    data,
  };
}
