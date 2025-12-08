import { Routes } from '@angular/router';
import { Home } from './screens/home/home';
import { FavoriteSearches } from './screens/favorite-searches/favorite-searches';
import { FavoriteArticles } from './screens/favorite-articles/favorite-articles';
import { ArticleView } from './screens/article-view/article-view';
import { HistoryScreen } from './screens/history/history';
import { FavoriteGroups } from './screens/favorite-groups/favorite-groups';
import { Settings } from './screens/settings/settings';

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
    },
    {
        path: 'favoriteGroups',
        component: FavoriteGroups,
    },
    {
        path: 'article/:id',
        component: ArticleView,
    },
    {
        path: 'history',
        component: HistoryScreen,
    },
    {
        path: 'settings',
        component: Settings,
    }
];

