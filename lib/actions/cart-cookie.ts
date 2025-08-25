"use server";

import { cookies } from "next/headers";

type ShoppingCartCheckout = {
  items: any[]; // Change `any[]` to your specific item type if available
  total?: number;
  type: "SUBSCRIPTION" | "COURSE" | "NONE"; // Extend with more plan types if needed
  itemCount?: number;
  currency?: "BDT"; // Extend with more currencies if needed
  lastUpdated?: string; // ISO date string
};

export const getServerCart = async (): Promise<ShoppingCartCheckout> => {
  const cookieStore = cookies();
  const cartCookie = cookieStore.get("shopping_cart");

  if (!cartCookie || !cartCookie.value || cartCookie.value.trim() === "") {
    return {
      items: [],
      total: 0,
      type: "NONE",
      itemCount: 0,
      currency: "BDT",
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    return JSON.parse(cartCookie.value);
  } catch (error) {
    console.error("Error parsing server cart:", error);
    return {
      items: [],
      type: "NONE",
      total: 0,
      itemCount: 0,
      currency: "BDT",
      lastUpdated: new Date().toISOString(),
    };
  }
};

export async function setServerCart(cartData: ShoppingCartCheckout) {
  const cookieStore = cookies();

  try {
    cookieStore.set({
      name: "shopping_cart",
      value: JSON.stringify(cartData),
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: false, // Must be false for client access
    });
    return true;
  } catch (error) {
    console.error("Error setting server cart:", error);
    return false;
  }
}

export async function clearServerCart() {
  const cookieStore = cookies();
  cookieStore.delete("shopping_cart");
  return true;
}
