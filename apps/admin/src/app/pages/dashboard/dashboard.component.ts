import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@dev-y/orders';
import { ProductsService } from '@dev-y/products';
import { UsersService } from '@dev-y/users';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics: any = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    /* 
     combineLatest позволяет объединить несколько потоков,
     беря самое последнее значение из каждого наблюдаемого входного сигнала
     и отправляя эти значения наблюдателю в виде комбинированного вывода
     (обычно в виде массива).
     */
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales()
    ])
      .pipe(takeUntil(this.endsubs$))
      .subscribe((values) => {
        console.log('DashboardComponent values - ', values);
        this.statistics = values;
      });
  }

  ngOnDestroy() {
    this.endsubs$.next(null);
    this.endsubs$.complete();
  }
}
