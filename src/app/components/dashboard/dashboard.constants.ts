import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class DashboardConstants {
    customersApp = 'customers'
    customersDashboard = '/store/customers';

    cartsApp = 'carts'
    cartsDashboard = '/store/carts';

    ordersApp = 'orders'
    ordersDashboard = '/store/orders';

    homeApp = 'store'
    homeDashboard = '/store/overview';
}