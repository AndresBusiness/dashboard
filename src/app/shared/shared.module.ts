import { NgModule } from '@angular/core';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports : [
    RouterModule
  ],
  declarations: [
    NopagefoundComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    LoadingComponent
  ],
  exports: [
    NopagefoundComponent,
    SidebarComponent,
    LoadingComponent,
    BreadcrumbsComponent
  ]
})
export class SharedModule { }
