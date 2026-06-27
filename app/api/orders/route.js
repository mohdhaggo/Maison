import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const SHIPPING_FLAT = 0; // free shipping; surfaced in UI

export async function POST(req) {
  try {
    const body = await req.json();
    const { customer, items, paymentMethod } = body;

    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return NextResponse.json({ error: "Please complete your delivery details." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    if (!["cod", "card"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Choose a payment method." }, { status: 400 });
    }

    const subtotal = items.reduce((n, i) => n + Number(i.price) * Number(i.qty), 0);
    const shipping = SHIPPING_FLAT;
    const total = subtotal + shipping;

    const session = await getSession();

    const order = await prisma.order.create({
      data: {
        userId: session?.id || null,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city || "",
        notes: customer.notes || "",
        itemsJson: JSON.stringify(items),
        subtotal,
        shipping,
        total,
        paymentMethod,
        // Card payments are not wired to a processor yet, so they wait for
        // confirmation; COD is accepted immediately.
        status: paymentMethod === "card" ? "awaiting_payment" : "confirmed",
      },
    });

    return NextResponse.json({
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not place your order." }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ orders: [] });
  }
  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      total: o.total,
      status: o.status,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      items: JSON.parse(o.itemsJson),
    })),
  });
}
