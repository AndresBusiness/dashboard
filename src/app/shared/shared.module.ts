import { NgModule } from '@angular/core';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports : [
    RouterModule
  ],
  declarations: [
    NopagefoundComponent,
    SidebarComponent,
    BreadcrumbsComponent
  ],
  exports: [
    NopagefoundComponent,
    SidebarComponent,
    BreadcrumbsComponent
  ]
})
export class SharedModule { }
