import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DashboardMetrics } from '../models/dashboards-metrics';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    controllerName: string = "Dashboard"
    private dashboardSubject = new BehaviorSubject<DashboardMetrics>(null);
    public dashboardMetrics$: Observable<DashboardMetrics> = this.dashboardSubject.asObservable();

    constructor(private apiService: ApiService) { 
    }

    loadMetrics(): void {
        this.apiService
          .get<DashboardMetrics>(this.controllerName)
          .pipe(
            tap((data) => this.dashboardSubject.next(data)),
            catchError((error) => {
              console.error('Error loading Dashboard Metrics', error);
              return [];
            })
          ).subscribe()
      }
}