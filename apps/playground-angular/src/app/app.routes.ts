import type { Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { ComponentsIndexComponent } from './explorer/components-index.component';
import { ComponentPageComponent } from './explorer/component-page.component';
import { IconBrowserComponent } from './explorer/icon-browser.component';

export const routes: Routes = [
  { path: '', component: CatalogueComponent },
  { path: 'components', component: ComponentsIndexComponent },
  { path: 'components/:tag', component: ComponentPageComponent },
  { path: 'icons/:family', component: IconBrowserComponent },
  { path: '**', redirectTo: '' },
];
