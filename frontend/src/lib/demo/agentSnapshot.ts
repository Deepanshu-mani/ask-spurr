type ShippingStatus = "Packed" | "In Transit" | "Out for Delivery" | "Delivered";

export interface DemoTimelineItem {
  label: string;
  time: string;
  done: boolean;
}

export interface DemoOrder {
  id: string;
  orderDate: string;
  product: string;
  price: string;
  status: ShippingStatus;
  summary: string;
  carrier: string;
  tracking: string;
  eta: string;
  lastUpdate: string;
  progress: number;
  accent: string;
  thumbnail: string;
  timeline: DemoTimelineItem[];
}

export interface DemoCustomerProfile {
  name: string;
  email: string;
  tier: string;
  location: string;
  avatar: string;
  note: string;
}

function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createThumbnail(label: string, accent: string, tone: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${tone}" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="120" height="120" rx="28" fill="url(#bg)" />
      <circle cx="88" cy="24" r="20" fill="rgba(255,255,255,0.18)" />
      <circle cx="28" cy="92" r="18" fill="rgba(255,255,255,0.14)" />
      <text x="16" y="69" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">${label}</text>
      <text x="16" y="92" fill="rgba(255,255,255,0.88)" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="600">Spurr order</text>
    </svg>`;

  return createSvgDataUri(svg);
}

function createAvatar(initials: string, accent: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${initials}">
      <defs>
        <linearGradient id="avatar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#avatar)" />
      <circle cx="60" cy="46" r="18" fill="rgba(255,255,255,0.18)" />
      <text x="60" y="72" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">${initials}</text>
    </svg>`;

  return createSvgDataUri(svg);
}

const jacketImage =
  "https://unsplash.com/photos/SHJXAe_G7O8/download?force=true";
const sneakersImage =
  "https://unsplash.com/photos/jVerIoX3y7c/download?force=true";
const headphonesImage =
  "https://unsplash.com/photos/rlJngr1ReOw/download?force=true";

export const demoCustomerProfile: DemoCustomerProfile = {
  name: "Ariana Stone",
  email: "ariana.stone@example.com",
  tier: "Gold Member",
  location: "Austin, TX",
  avatar: createAvatar("AS", "#2563eb"),
  note: "Customer opened 3 support chats this month, mostly about shipping and exchange updates.",
};

export const demoOrders: DemoOrder[] = [
  {
    id: "SE-48219",
    orderDate: "June 5, 2026",
    product: "Nimbus Trail Jacket",
    price: "$128.00",
    status: "Out for Delivery",
    summary: "Your order is on its way and should arrive today.",
    carrier: "UPS Ground",
    tracking: "1Z9A4X23-1849-UPS",
    eta: "Today, 6:00 PM",
    lastUpdate: "Arrived at Austin distribution center at 8:14 AM",
    progress: 86,
    accent: "#2563eb",
    thumbnail: jacketImage,
    timeline: [
      { label: "Packed at warehouse", time: "Jun 4, 6:40 PM", done: true },
      { label: "Picked up by UPS", time: "Jun 5, 9:10 AM", done: true },
      { label: "Sorted at regional hub", time: "Jun 6, 1:22 PM", done: true },
      { label: "Out for delivery", time: "Today, 8:14 AM", done: true },
    ],
  },
  {
    id: "SE-47102",
    orderDate: "June 2, 2026",
    product: "Cloudform Sneakers",
    price: "$94.00",
    status: "In Transit",
    summary: "Your order is moving through the carrier network.",
    carrier: "FedEx Home",
    tracking: "FDX-5520-0094",
    eta: "Tomorrow",
    lastUpdate: "Departed Dallas sorting facility at 11:08 PM",
    progress: 63,
    accent: "#0f766e",
    thumbnail: sneakersImage,
    timeline: [
      { label: "Order confirmed", time: "Jun 3, 10:12 AM", done: true },
      { label: "Package prepared", time: "Jun 4, 4:30 PM", done: true },
      { label: "In transit", time: "Jun 6, 11:08 PM", done: true },
      { label: "Estimated delivery", time: "Tomorrow", done: false },
    ],
  },
  {
    id: "SE-46588",
    orderDate: "May 23, 2026",
    product: "Studio Noise Cancelling Headphones",
    price: "$159.00",
    status: "Delivered",
    summary: "Your order was delivered yesterday with photo confirmation.",
    carrier: "USPS Priority",
    tracking: "9405 5036 9999 1234 5678 12",
    eta: "Delivered yesterday",
    lastUpdate: "Left at front door with photo confirmation",
    progress: 100,
    accent: "#7c3aed",
    thumbnail: headphonesImage,
    timeline: [
      { label: "Packed and labeled", time: "Jun 1, 2:16 PM", done: true },
      { label: "Accepted by USPS", time: "Jun 2, 9:48 AM", done: true },
      { label: "Delivered", time: "Yesterday, 3:22 PM", done: true },
      { label: "Photo confirmation", time: "Yesterday, 3:24 PM", done: true },
    ],
  },
];
