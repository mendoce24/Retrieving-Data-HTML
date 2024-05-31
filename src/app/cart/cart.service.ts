import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems()
    .reduce((accQty, item) => accQty + item.quantity, 0)
  );

  subTotal = computed(() => this.cartItems()
    .reduce((accTotal, item) => accTotal + (item.quantity * item.product.price), 0)
  );

  deliveryFee = computed(() => this.subTotal() < 50 ? 5.99 : 0);

  tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);

  TotalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

  eLength = effect(() => console.log('Cart array length:', this.cartItems().length));

  addToCart(product: Product): void {
    this.cartItems.update(items =>
      [...items, { product, quantity: 1 }]);
  }

  UpdateQuantity(cartItem: CartItem, quantity: number) {
    this.cartItems.update(items =>
      items.map(item => item.product.id === cartItem.product.id ?
        { ...item, quantity} : item)
    );
  }

  RemoveFromCart(cartItem: CartItem): void {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== cartItem.product.id)
    );
  }

}
