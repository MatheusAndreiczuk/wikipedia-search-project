import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./screens/home/home').then(m => m.Home),
    },
    {
        path: 'favoritedTerms',
        loadComponent: () => import('./screens/favorite-searches/favorite-searches').then(m => m.FavoriteSearches),
    },
    {
        path: 'favoritedArticles',
        loadComponent: () => import('./screens/favorite-articles/favorite-articles').then(m => m.FavoriteArticles),
    },
    {
        path: 'favoriteGroups',
        loadComponent: () => import('./screens/favorite-groups/favorite-groups').then(m => m.FavoriteGroups),
    },
    {
        path: 'article/:id',
        loadComponent: () => import('./screens/article-view/article-view').then(m => m.ArticleView),
    },
    {
        path: 'history',
        loadComponent: () => import('./screens/history/history').then(m => m.HistoryScreen),
    },
    {
        path: 'settings',
        loadComponent: () => import('./screens/settings/settings').then(m => m.Settings),
    }
];

