// Enhanced FAQ Knowledge Base for Spurr - Premium E-commerce Store
export const FAQ_KNOWLEDGE = {
    shipping: {
        domestic:
            'We offer FREE shipping on all orders over $75 within the US. Standard shipping (3-5 business days) is $8.99. Express shipping (1-2 days) is $19.99. Same-day delivery available in select metro areas for $29.99.',
        international:
            'We ship to over 150 countries worldwide! International shipping starts at $15 and typically takes 7-14 business days. Express international (3-5 days) available for $45.',
        tracking:
            "All orders include real-time tracking. You'll receive a tracking number via email within 24 hours of shipment.",
    },
    returns: {
        policy: 'We offer a hassle-free 60-day return policy! Items must be unused, unworn, and in original packaging with tags attached. We do NOT accept returns for worn, washed, damaged, or personalized items.',
        process:
            "To initiate a return: 1) Email support@spurr.com with your order number, 2) We'll send you a prepaid return label within 24 hours, 3) Drop off at any USPS location. Easy!",
        refunds:
            'Refunds are processed within 3-5 business days after we receive your return. Original shipping costs are non-refundable. Exchanges are always free!',
        exchanges:
            'Want a different size or color? Exchanges are FREE and ship priority! Just mention it when requesting your return.',
    },
    support: {
        hours: 'Our friendly customer support team is here to help! Monday-Friday: 8 AM - 8 PM EST, Saturday-Sunday: 10 AM - 6 PM EST. We respond to all emails within 2 hours during business hours!',
        contact:
            '📧 Email: support@spurr.com | 📞 Phone: 1-800-SPURR-1 (1-800-778-771) | 💬 Live Chat: Available on our website during business hours',
        liveChat: 'Live chat with a real human! No bots. Available Monday-Friday 8 AM - 8 PM EST.',
    },
    payment: {
        methods:
            'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, Venmo, and Afterpay (buy now, pay later in 4 interest-free installments).',
        security:
            'Your security is our priority! All payments are encrypted and processed securely through Stripe. We NEVER store your credit card information. PCI-DSS Level 1 certified.',
        installments:
            'Shop now, pay later! Use Afterpay or Klarna to split your purchase into 4 interest-free payments. No credit check required!',
    },
    products: {
        quality:
            'We source premium, sustainable materials and partner with ethical manufacturers. Every product comes with our Quality Guarantee.',
        warranty:
            'All products include a 1-year manufacturer warranty against defects. Extended warranties available at checkout.',
        sizeGuide:
            'Not sure about sizing? Check our detailed size guide on each product page, or chat with us for personalized recommendations!',
    },
    orders: {
        tracking:
            'Track your order anytime at spurr.com/track or click the tracking link in your shipping confirmation email.',
        modifications:
            "Need to change your order? Contact us within 1 hour of placing it and we'll do our best to modify it before it ships!",
        cancellation:
            'Orders can be cancelled within 2 hours of purchase for a full refund. After that, you can return it using our 60-day return policy.',
    },
    promotions: {
        discounts:
            'Sign up for our newsletter and get 15% off your first order! We also offer seasonal sales, flash deals, and exclusive member perks.',
        rewards:
            'Join Spurr Rewards (free!) and earn 1 point per dollar spent. 100 points = $5 off your next purchase!',
    },
};

export function getFAQContext(): string {
    return `
# Spurr - Premium E-commerce Store

## 🚚 Shipping Policy
- **FREE Shipping**: Orders over $75 (US only)
- **Standard Shipping**: $8.99 (3-5 business days)
- **Express Shipping**: $19.99 (1-2 days)
- **Same-Day Delivery**: $29.99 (select metro areas)
- **International**: Ships to 150+ countries, 7-14 days, starting at $15
- **Tracking**: Real-time tracking included with every order

## 🔄 Return & Refund Policy
- **Return Window**: 60 days from purchase (industry-leading!)
- **Condition**: Unused, unworn, original packaging with tags
- **NOT Accepted**: Worn, washed, damaged, or personalized items
- **Process**: Email support@spurr.com → Get prepaid label → Drop at USPS
- **Refunds**: Processed in 3-5 business days after we receive return
- **Exchanges**: FREE and ship priority! Perfect for size/color swaps

## 💬 Customer Support
- **Hours**: Mon-Fri 8 AM - 8 PM EST | Sat-Sun 10 AM - 6 PM EST
- **Response Time**: Within 2 hours during business hours
- **Email**: support@spurr.com
- **Phone**: 1-800-SPURR-1 (1-800-778-771)
- **Live Chat**: Real humans, no bots! Available Mon-Fri 8 AM - 8 PM EST

## 💳 Payment Methods
- **Cards**: Visa, Mastercard, Amex, Discover
- **Digital Wallets**: PayPal, Apple Pay, Google Pay, Venmo
- **Buy Now, Pay Later**: Afterpay, Klarna (4 interest-free payments)
- **Security**: PCI-DSS Level 1 certified, encrypted via Stripe
- **We NEVER store your credit card info**

## 📦 Order Management
- **Tracking**: Available at spurr.com/track or via email link
- **Modifications**: Contact within 1 hour of ordering
- **Cancellations**: Full refund if cancelled within 2 hours

## 🎁 Promotions & Rewards
- **New Customer**: 15% off first order (sign up for newsletter)
- **Spurr Rewards**: Earn 1 point per $1 spent, 100 points = $5 off
- **Seasonal Sales**: Flash deals and exclusive member perks

## ⭐ Product Quality
- **Materials**: Premium, sustainable, ethically sourced
- **Warranty**: 1-year manufacturer warranty on all products
- **Size Guide**: Detailed guides on every product page
`;
}
