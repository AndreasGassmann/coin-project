import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { CoinComponent } from './coin.component';
import { CoinRoutingModule } from './coin-routing.module';
import { CountoModule } from 'angular2-counto';

@NgModule({
    imports: [
        CoinRoutingModule,
        ChartsModule,
        CountoModule
    ],
    declarations: [CoinComponent]
})
export class CoinModule { }
