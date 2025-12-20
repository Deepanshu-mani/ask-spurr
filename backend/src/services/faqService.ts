// FAQ Knowledge Base for fictional e-commerce store
export const FAQ_KNOWLEDGE = {
  shipping: {
    domestic: "We offer free shipping on all orders over $50 within the US. Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for $15.",
    international: "We ship to over 100 countries worldwide. International shipping costs vary by location and typically takes 7-14 business days.",
  },
  returns: {
    policy: "We accept returns within 30 days of purchase. Items must be unused and in original packaging. We do NOT accept returns for worn, washed, or damaged items. Refunds are processed within 5-7 business days after we receive your return.",
    process: "To initiate a return, email support@store.com with your order number. We'll send you a prepaid return label.",
  },
  support: {
    hours: "Our customer support team is available Monday-Friday, 9 AM - 6 PM EST, and Saturday 10 AM - 4 PM EST. We are closed on Sundays. We respond to all emails within 24 hours.",
    contact: "Email: support@store.com | Phone: 1-800-SHOP-NOW",
    liveChat: "Live chat available during business hours",
  },
  payment: {
    methods: "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay.",
    security: "All payments are processed securely through Stripe. We never store your credit card information.",
  },
};
export function getFAQContext(): string {
  return `
# Store Information & FAQs
## Shipping Policy
- **Domestic (US)**: Free shipping on orders over $50. Standard delivery: 3-5 business days. Express shipping: $15 (1-2 days).
- **International**: We ship to 100+ countries. Delivery: 7-14 business days. Costs vary by location.
## Return & Refund Policy
- **Return Window**: 30 days from purchase
- **Condition**: Items must be unused and in original packaging. We do NOT accept worn or damaged items.
- **Refund Timeline**: 5-7 business days after we receive your return
- **Process**: Email support@store.com with your order number for a prepaid return label
## Customer Support
- **Hours**: Monday-Friday, 9 AM - 6 PM EST; Saturday, 10 AM - 4 PM EST; Closed Sunday
- **Response Time**: Within 24 hours
- **Contact**: support@store.com | 1-800-SHOP-NOW
## Payment Methods
- **Accepted**: Visa, Mastercard, Amex, PayPal, Apple Pay
- **Security**: All payments processed securely through Stripe. We never store credit card info.
`;
}