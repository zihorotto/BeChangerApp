import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { authGuard } from './guard/auth.guard';
import { ManageProductComponent } from './pages/manage-product/manage-product.component';
import { BorrowedProductsComponent } from './pages/borrowed-products/borrowed-products.component';
import { ReturnedProductsComponent } from './pages/returned-products/returned-products.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/products',
        pathMatch: 'full',
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            component: ProductListComponent,
          },
          {
            path: 'my-products',
            component: MyProductsComponent,
          },
          {
            path: 'manage',
            component: ManageProductComponent,
          },
          {
            path: 'manage/:productId',
            component: ManageProductComponent,
          },
          {
            path: 'borrowed-products',
            component: BorrowedProductsComponent,
          },
          {
            path: 'returned-products',
            component: ReturnedProductsComponent,
          },
        ],
      },
    ],
  },
];
// {
//     path: 'admin/workspaces',
//     loadChildren: () => import('./features/workspaces/workspaces.routes'),
//   },
