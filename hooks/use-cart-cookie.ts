//@ts-nocheck
"use client";

class CartCookieManager {
  constructor(options = {}) {
    this.cookieName = options.cookieName || "shopping_cart";
    this.domain = options.domain || undefined; // Let Next.js handle domain
    this.path = options.path || "/";
    this.secure =
      options.secure !== undefined
        ? options.secure
        : process.env.NODE_ENV === "production";
    this.sameSite = options.sameSite || "lax";
    this.maxAge = options.maxAge || 7 * 24 * 60 * 60; // 7 days in seconds
    this.httpOnly = false; // Must be false for client-side access
  }

  // Check if running on client side
  isClient() {
    return typeof window !== "undefined";
  }

  // Set cookie with Next.js considerations
  setCookie(name, value, options = {}) {
    if (!this.isClient()) {
      console.warn(
        "setCookie called on server side, use server actions instead"
      );
      return false;
    }

    const opts = { ...this.getDefaultOptions(), ...options };
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (opts.maxAge) cookieString += `; Max-Age=${opts.maxAge}`;
    if (opts.expires) cookieString += `; Expires=${opts.expires.toUTCString()}`;
    if (opts.path) cookieString += `; Path=${opts.path}`;
    if (opts.domain) cookieString += `; Domain=${opts.domain}`;
    if (opts.secure) cookieString += `; Secure`;
    if (opts.sameSite) cookieString += `; SameSite=${opts.sameSite}`;

    document.cookie = cookieString;
    return true;
  }

  // Get cookie value (client-side only)
  getCookie(name) {
    if (!this.isClient()) {
      console.warn(
        "getCookie called on server side, use server actions instead"
      );
      return null;
    }

    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  // Delete cookie
  deleteCookie(name, options = {}) {
    if (!this.isClient()) {
      console.warn(
        "deleteCookie called on server side, use server actions instead"
      );
      return false;
    }

    const opts = { ...this.getDefaultOptions(), ...options };
    this.setCookie(name, "", {
      ...opts,
      maxAge: 0,
      expires: new Date(0),
    });
    return true;
  }

  // Get default cookie options
  getDefaultOptions() {
    return {
      domain: this.domain,
      path: this.path,
      secure: this.secure,
      sameSite: this.sameSite,
      maxAge: this.maxAge,
      httpOnly: this.httpOnly,
    };
  }

  // Save cart data to cookie
  saveCart(cartData) {
    if (!this.isClient()) {
      console.warn("saveCart called on server side");
      return false;
    }

    try {
      const cartJson = JSON.stringify(cartData);

      // Check if cart data exceeds cookie size limit (4KB)
      if (cartJson.length > 4000) {
        console.warn("Cart data exceeds recommended cookie size limit");
        // Consider using localStorage or server-side session
      }

      const success = this.setCookie(this.cookieName, cartJson);
      if (success) {
        // console.log("Cart saved to cookie successfully");
        // Trigger custom event for React components to listen
        if (window.dispatchEvent) {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", {
              detail: cartData,
            })
          );
        }
      }
      return success;
    } catch (error) {
      console.error("Error saving cart to cookie:", error);
      return false;
    }
  }

  // Load cart data from cookie
  loadCart() {
    if (!this.isClient()) {
      return this.getEmptyCart();
    }

    try {
      const cartJson = this.getCookie(this.cookieName);
      if (!cartJson) {
        return this.getEmptyCart();
      }

      const cartData = JSON.parse(cartJson);

      // Validate cart structure
      if (!this.validateCartData(cartData)) {
        console.warn("Invalid cart data found, resetting cart");
        return this.getEmptyCart();
      }

      return cartData;
    } catch (error) {
      console.error("Error loading cart from cookie:", error);
      return this.getEmptyCart();
    }
  }

  // Clear cart cookie
  clearCart() {
    if (!this.isClient()) {
      console.warn("clearCart called on server side");
      return false;
    }

    const success = this.deleteCookie(this.cookieName);
    if (success) {
      // console.log("Cart cleared from cookie");
      // Trigger custom event
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("cartCleared"));
      }
    }
    return success;
  }

  // Get empty cart structure
  getEmptyCart() {
    return {
      items: [],
      total: 0,
      itemCount: 0,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
    };
  }

  // Validate cart data structure
  validateCartData(cartData) {
    return (
      cartData &&
      typeof cartData === "object" &&
      Array.isArray(cartData.items) &&
      typeof cartData.total === "number" &&
      typeof cartData.itemCount === "number"
    );
  }

  // Add item to cart
  addItem(product) {
    const cart = this.loadCart();
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.options || {}) ===
          JSON.stringify(product.options || {})
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += product.quantity || 1;
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
        image: product.image || null,
        options: product.options || {},
        addedAt: new Date().toISOString(),
      });
    }

    this.updateCartTotals(cart);
    this.saveCart(cart);
    return cart;
  }

  // Remove item from cart
  removeItem(productId, options = {}) {
    const cart = this.loadCart();
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.id === productId &&
        JSON.stringify(item.options || {}) === JSON.stringify(options)
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      this.updateCartTotals(cart);
      this.saveCart(cart);
    }

    return cart;
  }

  // Update item quantity
  updateItemQuantity(productId, quantity, options = {}) {
    const cart = this.loadCart();
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.id === productId &&
        JSON.stringify(item.options || {}) === JSON.stringify(options)
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      this.updateCartTotals(cart);
      this.saveCart(cart);
    }

    return cart;
  }

  // Update cart totals
  updateCartTotals(cart) {
    cart.itemCount = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cart.lastUpdated = new Date().toISOString();
  }

  // Get cart summary
  getCartSummary() {
    const cart = this.loadCart();
    return {
      itemCount: cart.itemCount,
      total: cart.total,
      currency: cart.currency,
      isEmpty: cart.items.length === 0,
    };
  }
}
// Export everything
export { CartCookieManager };
