import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CardComponent } from './pages/card/card.component';
import { FormRequestComponent } from './pages/form-request/form-request.component';
import { RequestSuccessComponent } from './pages/request-success/request-success.component';

export const routes: Routes = [
    {
        path: '',
        component: MainPageComponent
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
    }
];
