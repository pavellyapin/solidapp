import { Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-dashboard-order-status',
    templateUrl: './order-status.component.html',
    styleUrls: ['./order-status.component.scss']
})
export class DashboardOrderStatusComponent implements OnInit {

    @Input()
    order : any;


    constructor() {
    }

    ngOnInit() {
        //console.log(this.order);
    }

    ngOnDestroy(): void {
    }

}
