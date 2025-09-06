import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './admin-dashboard-page.component';

const routes: Routes = [{ path: '', component: AdminDashboardPageComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminDashboardPageComponent,
  ],
})
export class AdminDashboardPageModule {}
