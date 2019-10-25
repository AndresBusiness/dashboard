import { NgModule } from '@angular/core';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { CommonModule } from '@angular/common';
import { PaginadorComponent } from './paginador/paginador.component';

@NgModule({
  imports : [
    RouterModule,
    CommonModule
  ],
  declarations: [
    NopagefoundComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    LoadingComponent,
    PaginadorComponent
  ],
  exports: [
    NopagefoundComponent,
    SidebarComponent,
    LoadingComponent,
    BreadcrumbsComponent,
    PaginadorComponent
  ],
  entryComponents:[PaginadorComponent]
})
export class SharedModule { }
