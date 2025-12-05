import { Routes } from '@angular/router';
import { Home } from './screens/home/home';
import { FavoriteSearches } from './screens/favorite-searches/favorite-searches';
import { FavoriteArticles } from './screens/favorite-articles/favorite-articles';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'favoritedTerms',
        component: FavoriteSearches,
    },
    {
        path: 'favoritedArticles',
        component: FavoriteArticles,
    }
];
