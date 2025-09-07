// Helper to manage localStorage with expiration
export const manageLocalStorage = {
  setWithExpiry(key: string, value: string, ttl: number) {
    // Check if localStorage is available (client-side)
    if (typeof window !== "undefined") {
      const now = new Date();
      const item = {
        value,
        expiry: now.getTime() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    }
  },

  getWithExpiry(key: string) {
    // Check if localStorage is available (client-side)
    if (typeof window !== "undefined") {
      const itemStr = localStorage?.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    }
    return null;
  },

  remove(key: string) {
    // Check if localStorage is available (client-side)
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

// Specific functions for checkout email
export const CheckoutStorage = {
  STORAGE_KEY: "email",
  TTL: 7 * 24 * 60 * 60 * 1000, // 7 days in ms

  saveEmail(email: string) {
    manageLocalStorage.setWithExpiry(this.STORAGE_KEY, email, this.TTL);
  },

  getEmail() {
    return manageLocalStorage.getWithExpiry(this.STORAGE_KEY);
  },

  clearEmail() {
    manageLocalStorage.remove(this.STORAGE_KEY);
  },
};

// Specific functions for checkout user details
export const UserStorage = {
  STORAGE_KEYS: {
    NAME: "user_name",
    PHONE: "user_phone",
    PROFESSION: "user_profession",
  },
  TTL: 7 * 24 * 60 * 60 * 1000, // 7 days in ms

  saveName(name: string) {
    manageLocalStorage.setWithExpiry(this.STORAGE_KEYS.NAME, name, this.TTL);
  },
  getName() {
    return manageLocalStorage.getWithExpiry(this.STORAGE_KEYS.NAME);
  },
  clearName() {
    manageLocalStorage.remove(this.STORAGE_KEYS.NAME);
  },

  savePhone(phoneNumber: string) {
    manageLocalStorage.setWithExpiry(this.STORAGE_KEYS.PHONE, phoneNumber, this.TTL);
  },
  getPhone() {
    return manageLocalStorage.getWithExpiry(this.STORAGE_KEYS.PHONE);
  },
  clearPhone() {
    manageLocalStorage.remove(this.STORAGE_KEYS.PHONE);
  },

  saveProfession(profession: string) {
    manageLocalStorage.setWithExpiry(this.STORAGE_KEYS.PROFESSION, profession, this.TTL);
  },
  getProfession() {
    return manageLocalStorage.getWithExpiry(this.STORAGE_KEYS.PROFESSION);
  },
  clearProfession() {
    manageLocalStorage.remove(this.STORAGE_KEYS.PROFESSION);
  },
};
