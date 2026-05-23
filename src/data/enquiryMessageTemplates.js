const SHARED_FOOTER = `Preferred dates:
Number of guests:

Any special requests:

Thank you.`;

export const ENQUIRY_MESSAGE_TEMPLATES = {
  default: `Hello Luxe Adobes team,

I would like to enquire about availability and rates for an upcoming stay. Please share options that suit my dates and group size.

${SHARED_FOOTER}`,

  'wayanad-gate': `Hello Luxe Adobes team,

I am interested in staying at Wayanad Gate. Could you please share availability, room types, and rates for my dates?

${SHARED_FOOTER}`,

  'ubuntu-retreat-ooty': `Hello Luxe Adobes team,

I am interested in Ubuntu Retreat – Aaram & Mukaam in Ooty. Could you please share villa availability and rates for my dates?

${SHARED_FOOTER}`,

  stayaro: `Hello Luxe Adobes team,

I am interested in STAYARO. Please share updates on availability and how I can plan a stay when you are open.

${SHARED_FOOTER}`,

  'cloud-veil': `Hello Luxe Adobes team,

I am interested in Cloud Veil. Please share updates on availability and how I can plan a stay when you are open.

${SHARED_FOOTER}`,
};

export function getEnquiryMessageTemplate(propertySlug, properties = []) {
  if (!propertySlug) {
    return ENQUIRY_MESSAGE_TEMPLATES.default;
  }
  if (ENQUIRY_MESSAGE_TEMPLATES[propertySlug]) {
    return ENQUIRY_MESSAGE_TEMPLATES[propertySlug];
  }
  const match = properties.find((p) => p.slug === propertySlug);
  const name = match?.name ?? propertySlug;
  return `Hello Luxe Adobes team,

I am interested in ${name}. Could you please share availability and rates for my dates?

${SHARED_FOOTER}`;
}
