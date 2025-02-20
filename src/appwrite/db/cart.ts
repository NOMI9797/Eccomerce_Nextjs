export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export const cartService = {
  getCartKey(userId: string) {
    return `shopping_cart_${userId}`;
  },

  getCart(userId: string): Cart {
    const cartData = localStorage.getItem(this.getCartKey(userId));
    if (cartData) {
      return JSON.parse(cartData);
    }
    return { items: [], total: 0 };
  },

  saveCart(userId: string, cart: Cart) {
    localStorage.setItem(this.getCartKey(userId), JSON.stringify(cart));
  },

  addItem(userId: string, item: CartItem) {
    const cart = this.getCart(userId);
    const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    cart.total = this.calculateTotal(cart.items);
    this.saveCart(userId, cart);
    return cart;
  },

  removeItem(userId: string, productId: string) {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.total = this.calculateTotal(cart.items);
    this.saveCart(userId, cart);
    return cart;
  },

  updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = this.getCart(userId);
    const item = cart.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      cart.total = this.calculateTotal(cart.items);
      this.saveCart(userId, cart);
    }
    return cart;
  },

  clearCart(userId: string) {
    localStorage.removeItem(this.getCartKey(userId));
    return { items: [], total: 0 };
  },

  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};