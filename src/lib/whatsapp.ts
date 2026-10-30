/** Every point of contact on the site funnels into the salon owner's WhatsApp. */
export const OWNER_WHATSAPP = "919173414508";
export const OWNER_PHONE_DISPLAY = "091734 14508";
export const SALON_NAME = "Sachin Family Salon";

export function waLink(phone: string | null | undefined, message: string) {
  const number = (phone || OWNER_WHATSAPP).replace(/\D/g, "") || OWNER_WHATSAPP;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const salon = (name?: string | null) => name || SALON_NAME;

export const waMessage = {
  general: (name?: string | null) =>
    `Hello ${salon(name)}! I found you on your website and I'd like to know more about your wigs, hair patches and salon services.`,

  booking: (name?: string | null) =>
    `Hello ${salon(name)}! I'd like to book a free trial sitting. Please share the available slots.`,

  branch: (city: string, name?: string | null) =>
    `Hello ${salon(name)}! I'd like to know more about the ${city} branch — timings, services and booking a visit.`,


  service: (service: string, name?: string | null) =>
    `Hello ${salon(name)}! I'm interested in your "${service}" service. Could you share the details, price and available timings?`,

  product: (
    product: { name: string; price: number; slug: string; quantity?: number },
    name?: string | null,
  ) =>
    [
      `Hello ${salon(name)}! I'd like to enquire about this product from your website:`,
      "",
      `• ${product.name}${product.quantity && product.quantity > 1 ? ` × ${product.quantity}` : ""}`,
      `• Price: ₹${Math.round(product.price).toLocaleString("en-IN")}`,
      "",
      "Please tell me about availability, fitting and delivery.",
    ].join("\n"),

  cart: (
    lines: { name: string; quantity: number; price: number }[],
    total: number,
    name?: string | null,
  ) =>
    [
      `Hello ${salon(name)}! I would like to book the following items:`,
      "",
      ...lines.map(
        (l) => `• ${l.name} × ${l.quantity} — ₹${Math.round(l.price * l.quantity).toLocaleString("en-IN")}`,
      ),
      "",
      `Total: ₹${Math.round(total).toLocaleString("en-IN")}`,
      "",
      "Please confirm availability and let me know the next step.",
    ].join("\n"),
};
