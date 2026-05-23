import { useRef, useState } from 'react';
import Button from './Button';
import { siteWhatsAppUrl } from '../../data/siteContact';
import { getEnquiryMessageTemplate } from '../../data/enquiryMessageTemplates';
import { isEmailjsConfigured, sendEnquiryEmail } from '../../utils/sendEnquiryEmail';

/** WhatsApp prefill URLs can break if the query is extremely long */
const WHATSAPP_TEXT_SAFE_MAX = 1800;

function propertyDisplayName(slug, properties) {
  if (!slug?.trim()) return 'No preference';
  const match = properties.find((p) => p.slug === slug);
  return match ? match.name : slug;
}

function buildEnquiryWhatsAppBody(data, properties) {
  const lines = [
    '*Enquiry  -  Luxe Adobes*',
    '',
    `*Name:* ${data.name.trim()}`,
    `*Email:* ${data.email.trim() || ' - '}`,
    `*Phone:* ${data.phone.trim() || ' - '}`,
    `*Property:* ${propertyDisplayName(data.property, properties)}`,
    '',
    '*Message:*',
    data.message.trim(),
  ];
  let text = lines.join('\n');
  if (text.length > WHATSAPP_TEXT_SAFE_MAX) {
    text = `${text.slice(0, WHATSAPP_TEXT_SAFE_MAX - 24)}\n\n…(truncated)`;
  }
  return text;
}

const inputClass = (invalid) =>
  [
    'w-full rounded-lg border bg-white/70 px-4 py-3 text-[15px] text-charcoal transition-colors',
    'placeholder:text-soft/50 focus:outline-none focus:ring-1',
    invalid
      ? 'border-red-300/80 focus:border-red-400 focus:ring-red-200'
      : 'border-charcoal/10 focus:border-gold/50 focus:ring-gold/20',
  ].join(' ');

const fieldErrorClass = 'mt-1.5 text-xs font-medium text-red-700';
const fieldErrorClassDefault = 'mt-1 text-sm font-medium text-red-700';

const successBannerClass =
  'rounded-lg border border-emerald-200/90 bg-emerald-50 px-4 py-3.5 text-center shadow-sm';
const successBannerTextClass = 'text-sm font-medium text-emerald-800';

const errorBannerClass =
  'rounded-lg border border-red-200/90 bg-red-50 px-4 py-3.5 text-center shadow-sm';
const errorBannerTextClass = 'text-sm font-medium text-red-800';

const contactErrorBoxClass =
  'rounded-md border border-red-200/80 bg-red-50/80 px-3 py-2 text-xs font-medium text-red-700';

function MailIcon({ className = 'h-4 w-4 shrink-0' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function ContactForm({ properties = [], onSubmit, variant = 'default' }) {
  const messageDirtyRef = useRef(false);
  const lastTemplatePropertyRef = useRef('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    message: getEnquiryMessageTemplate('', properties),
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const hasErrors = Object.keys(errors).length > 0;
  const showTemplateHint = properties.length > 0;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const applyPropertyMessageTemplate = (propertySlug, prev) => {
    const template = getEnquiryMessageTemplate(propertySlug, properties);
    const prevTemplate = getEnquiryMessageTemplate(lastTemplatePropertyRef.current, properties);
    const shouldReplace =
      !messageDirtyRef.current ||
      prev.message.trim() === '' ||
      prev.message === prevTemplate;

    lastTemplatePropertyRef.current = propertySlug;
    return shouldReplace ? template : prev.message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'message') {
      messageDirtyRef.current = true;
    }

    if (name === 'property') {
      setFormData((prev) => ({
        ...prev,
        property: value,
        message: applyPropertyMessageTemplate(value, prev),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => {
      const next = { ...prev, [name]: '' };
      if (name === 'email' || name === 'phone') {
        next.contact = '';
      }
      return next;
    });
    if (submitAttempted) {
      setSubmitAttempted(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailTrim = formData.email.trim();
    const phoneTrim = formData.phone.trim();
    const phoneDigits = phoneTrim.replace(/\D/g, '');
    const hasPhone = phoneDigits.length > 0;
    const hasEmail = emailTrim.length > 0;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!hasPhone && !hasEmail) {
      newErrors.contact = 'Please provide an email or phone number so we can reach you.';
    } else {
      if (hasPhone && phoneDigits.length < 8) {
        newErrors.phone = 'Please enter a valid phone number.';
      }
      if (hasEmail && !emailPattern.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openWhatsAppWithForm = () => {
    setSubmitAttempted(true);
    if (!validate()) return;
    setSubmitAttempted(false);
    const body = buildEnquiryWhatsAppBody(formData, properties);
    const url = siteWhatsAppUrl(body);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const resetFormAfterSuccess = () => {
    setTimeout(() => {
      messageDirtyRef.current = false;
      lastTemplatePropertyRef.current = '';
      setFormData({
        name: '',
        email: '',
        phone: '',
        property: '',
        message: getEnquiryMessageTemplate('', properties),
      });
      setIsSubmitted(false);
    }, 3200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setSubmitAttempted(false);

    if (!isEmailjsConfigured()) {
      setSubmitError(
        'Email delivery is not configured yet. Please use WhatsApp or email info@luxeadobes.com.',
      );
      return;
    }

    setIsSending(true);
    try {
      await sendEnquiryEmail(formData, properties);
      onSubmit?.(formData);
      setIsSubmitted(true);
      resetFormAfterSuccess();
    } catch {
      setSubmitError(
        'We could not send your enquiry. Please try again, use WhatsApp, or email info@luxeadobes.com.',
      );
    } finally {
      setIsSending(false);
    }
  };

  if (variant === 'studio') {
    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-charcoal">
            Name <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p id="name-error" className={fieldErrorClass} role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-soft">Email or phone  -  at least one is required.</p>
          {errors.contact && (
            <p id="contact-error" className={contactErrorBoxClass} role="alert">
              {errors.contact}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-charcoal">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            aria-invalid={errors.email || errors.contact ? 'true' : 'false'}
            aria-describedby={
              errors.email ? 'email-error' : errors.contact ? 'contact-error' : undefined
            }
            className={inputClass(!!(errors.email || errors.contact))}
          />
          {errors.email && (
            <p id="email-error" className={fieldErrorClass} role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm text-charcoal">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            aria-invalid={errors.phone || errors.contact ? 'true' : 'false'}
            aria-describedby={
              errors.phone ? 'phone-error' : errors.contact ? 'contact-error' : undefined
            }
            className={inputClass(!!(errors.phone || errors.contact))}
          />
          {errors.phone && (
            <p id="phone-error" className={fieldErrorClass} role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        {properties.length > 0 && (
          <div>
            <label htmlFor="property" className="mb-1.5 block text-sm text-charcoal">
              Property
            </label>
            <div className="relative">
              <select
                id="property"
                name="property"
                value={formData.property}
                onChange={handleChange}
                className={`${inputClass(false)} cursor-pointer appearance-none pr-10`}
              >
                <option value="">No preference</option>
                {properties.map((property) => (
                  <option key={property.slug} value={property.slug}>
                    {property.name}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/35"
                aria-hidden
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            {showTemplateHint && (
              <p className="mt-1.5 text-xs text-soft">
                Choosing a property fills the message below — edit any line before you send.
              </p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm text-charcoal">
            Message <span className="text-gold">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`${inputClass(!!errors.message)} resize-none`}
          />
          {errors.message && (
            <p id="message-error" className={fieldErrorClass} role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-charcoal/5 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="order-1 border-[#128C7E]/45 bg-white/90 text-[#075E54] hover:!border-[#25D366] hover:!bg-[#25D366] hover:!text-white hover:!shadow-md sm:order-2"
              onClick={openWhatsAppWithForm}
            >
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Send via WhatsApp
              </span>
            </Button>
            <Button type="submit" variant="outline" className="order-2 sm:order-1" disabled={isSending}>
              <span className="inline-flex items-center gap-2">
                <MailIcon />
                {isSending ? 'Sending…' : 'Send enquiry'}
              </span>
            </Button>
          </div>

          {submitError && (
            <div className={errorBannerClass} role="alert" aria-live="polite">
              <p className={errorBannerTextClass}>{submitError}</p>
            </div>
          )}

          {submitAttempted && hasErrors && (
            <div className={errorBannerClass} role="alert" aria-live="polite">
              <p className={errorBannerTextClass}>
                Please fix the errors above before sending your enquiry.
              </p>
            </div>
          )}

          {isSubmitted && (
            <div className={successBannerClass} role="status" aria-live="polite">
              <p className={successBannerTextClass}>Thank you  -  we&apos;ll be in touch shortly.</p>
            </div>
          )}

          <p className="text-xs text-soft">
            WhatsApp opens with your details in the message box so you can review and send.
          </p>
          <p className="text-xs text-soft">Your details are kept confidential.</p>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name-default" className="mb-2 block font-medium text-charcoal">
          Name <span className="text-gold">*</span>
        </label>
        <input
          type="text"
          id="name-default"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 transition focus:outline-none ${
            errors.name ? 'border-red-300 focus:border-red-500' : 'border-sand focus:border-gold'
          }`}
        />
        {errors.name && (
          <p className={fieldErrorClassDefault} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-soft">Email or phone  -  at least one is required.</p>
        {errors.contact && (
          <p id="contact-error" className={contactErrorBoxClass} role="alert">
            {errors.contact}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email-default" className="mb-2 block font-medium text-charcoal">
          Email
        </label>
        <input
          type="email"
          id="email-default"
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={errors.email || errors.contact ? 'true' : 'false'}
          aria-describedby={
            errors.email ? 'email-error-default' : errors.contact ? 'contact-error' : undefined
          }
          className={`w-full rounded-lg border px-4 py-3 transition focus:outline-none ${
            errors.email || errors.contact
              ? 'border-red-300 focus:border-red-500'
              : 'border-sand focus:border-gold'
          }`}
        />
        {errors.email && (
          <p id="email-error-default" className={fieldErrorClassDefault} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone-default" className="mb-2 block font-medium text-charcoal">
          Phone
        </label>
        <input
          type="tel"
          id="phone-default"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          aria-invalid={errors.phone || errors.contact ? 'true' : 'false'}
          aria-describedby={
            errors.phone ? 'phone-error-default' : errors.contact ? 'contact-error' : undefined
          }
          className={`w-full rounded-lg border px-4 py-3 transition focus:outline-none ${
            errors.phone || errors.contact
              ? 'border-red-300 focus:border-red-500'
              : 'border-sand focus:border-gold'
          }`}
        />
        {errors.phone && (
          <p id="phone-error-default" className={fieldErrorClassDefault} role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {properties.length > 0 && (
        <div>
          <label htmlFor="property-default" className="mb-2 block font-medium text-charcoal">
            Property of Interest
          </label>
          <select
            id="property-default"
            name="property"
            value={formData.property}
            onChange={handleChange}
            className="w-full rounded-lg border border-sand bg-warm px-4 py-3 transition focus:border-gold focus:outline-none"
          >
            <option value="">Select a property (optional)</option>
            {properties.map((property) => (
              <option key={property.slug} value={property.slug}>
                {property.name}
              </option>
            ))}
          </select>
          {showTemplateHint && (
            <p className="mt-1.5 text-sm text-soft">
              Choosing a property fills the message below — edit any line before you send.
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="message-default" className="mb-2 block font-medium text-charcoal">
          Message <span className="text-gold">*</span>
        </label>
        <textarea
          id="message-default"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className={`w-full resize-none rounded-lg border px-4 py-3 transition focus:outline-none ${
            errors.message ? 'border-red-300 focus:border-red-500' : 'border-sand focus:border-gold'
          }`}
        />
        {errors.message && (
          <p className={fieldErrorClassDefault} role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-charcoal/5 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button type="submit" variant="outline" disabled={isSending}>
            <span className="inline-flex items-center gap-2">
              <MailIcon />
              {isSending ? 'Sending…' : 'Send Enquiry'}
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-[#128C7E]/45 bg-white/90 text-[#075E54] hover:!border-[#25D366] hover:!bg-[#25D366] hover:!text-white hover:!shadow-md"
            onClick={openWhatsAppWithForm}
          >
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Send via WhatsApp
            </span>
          </Button>
        </div>

        {submitError && (
          <div className={errorBannerClass} role="alert" aria-live="polite">
            <p className={errorBannerTextClass}>{submitError}</p>
          </div>
        )}

        {submitAttempted && hasErrors && (
          <div className={errorBannerClass} role="alert" aria-live="polite">
            <p className={errorBannerTextClass}>
              Please fix the errors above before sending your enquiry.
            </p>
          </div>
        )}

        {isSubmitted && (
          <div className={successBannerClass} role="status" aria-live="polite">
            <p className={successBannerTextClass}>
              Thank you for your enquiry! We&apos;ll get back to you soon.
            </p>
          </div>
        )}

        <p className="text-sm text-soft">
          WhatsApp opens with your enquiry in the chat box (same checks as the form).
        </p>
      </div>
    </form>
  );
}

export default ContactForm;
