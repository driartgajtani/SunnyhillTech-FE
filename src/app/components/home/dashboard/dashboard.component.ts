import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardMetrics } from '../../../models/dashboards-metrics';
import { DashboardService } from '../../../services/dashboard.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalProductsCount: number;
  totalUserCount: number;


  constructor(private dashboardService: DashboardService) {
    this.dashboardService.loadMetrics();
    this.dashboardService.dashboardMetrics$.subscribe(
      ((res: DashboardMetrics) => {
        this.totalProductsCount = res?.productCount;
        this.totalUserCount = res?.userCount;
      })
    )
  }
}
