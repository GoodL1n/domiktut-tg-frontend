import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CardComponent } from './pages/card/card.component';
import { FormRequestComponent } from './components/form-request/form-request.component';
import { RequestSuccessComponent } from './pages/request-success/request-success.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { SelectGeoComponent } from './pages/select-geo/select-geo.component';

export const routes: Routes = [
    {
        path: '',
        component: MainPageComponent
    },
    {
        path: 'select-geo',
        component: SelectGeoComponent
    },
    {
        path: 'catalog',
        component: CatalogComponent
    },
    {
        path: 'card',
        component: CardComponent
    },
    {
        path: 'form-request',
        component: FormRequestComponent
    },
    {
        path: 'request-success',
        component: RequestSuccessComponent
    },
    {
        path: 'error',
        component: ErrorPageComponent
    }
];
