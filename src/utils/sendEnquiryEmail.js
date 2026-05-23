import emailjs from '@emailjs/browser';

function propertyDisplayName(slug, properties) {
  if (!slug?.trim()) return 'No preference';
  const match = properties.find((p) => p.slug === slug);
  return match ? match.name : slug;
}

export function isEmailjsConfigured() {
  return Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  );
}

/**
 * Sends the enquiry notification via EmailJS (Zoho service in dashboard).
 * Template params must match docs/emailjs-enquiry-template.html.
 */
export async function sendEnquiryEmail(formData, properties = []) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EMAILJS_NOT_CONFIGURED');
  }

  const guestEmail = formData.email.trim();

  const templateParams = {
    name: formData.name.trim(),
    email: guestEmail || 'Not provided',
    phone: formData.phone.trim() || 'Not provided',
    property: propertyDisplayName(formData.property, properties),
    message: formData.message.trim(),
  };

  if (guestEmail) {
    templateParams.reply_to = guestEmail;
  }

  return emailjs.send(serviceId, templateId, templateParams, { publicKey });
}
