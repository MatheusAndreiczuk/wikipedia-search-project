import { Routes } from '@angular/router';
import { Home } from './screens/home/home';
import { FavoriteSearches } from './screens/favorite-searches/favorite-searches';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'favoriteSearches',
        component: FavoriteSearches,
    }
];
