import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy{
  @Input() productId: number = 0;
  errorMessage = '';
  sub!: Subscription;

  // Product to display
  private productService = inject(ProductService);
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  addToCart(product: Product) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;
    if (id) {
      this.sub = this.productService.getProduct(id)
        .pipe(
          tap(() => console.log('Pipeline Product retrieved')),
          catchError(err => {
            this.errorMessage = err;
            return EMPTY;
          })
        ).subscribe({
          next: product => this.product = product
        });
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
