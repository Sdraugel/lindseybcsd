import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Shop } from './sections/shop/shop';

/**
 * Two prerendered routes (see prerender.routes.txt):
 *   '/'      the single-page campaign home (all sections)
 *   '/shop'  the merch store (Shopify collection embed)
 * Unknown paths fall back to home.
 */
export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Draugel for School Board · District 2',
  },
  {
    path: 'shop',
    component: Shop,
    title: 'Shop · Draugel for District 2',
  },
  { path: '**', redirectTo: '' },
];
