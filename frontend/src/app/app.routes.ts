import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { authGuard } from './guard/auth.guard';
import { GameListComponent } from './pages/game-list/game-list.component';
import { MyGamesComponent } from './components/my-games/my-games.component';
import { ManageGameComponent } from './pages/manage-game/manage-game.component';
import { BorrowedProductsComponent } from './pages/borrowed-products/borrowed-products.component';
import { ReturnedProductsComponent } from './pages/returned-products/returned-products.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: '/games',
                pathMatch: 'full',
            },
            {
                path: 'games',
                children: [
                    {
                        path: '',
                        component: GameListComponent,
                    },
                    {
                        path: 'my-games',
                        component: MyGamesComponent,
                    },
                    {
                        path: 'manage',
                        component: ManageGameComponent,
                    },
                    {
                        path: 'manage/:gameId',
                        component: ManageGameComponent,
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
        ]
    },
];
// {
//     path: 'admin/workspaces',
//     loadChildren: () => import('./features/workspaces/workspaces.routes'),
//   },