import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import { CoinComponent } from './coin.component';

const routes: Routes = [
    {
        path: '',
        component: CoinComponent,
        data: {
            title: 'Coin'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoinRoutingModule { }
