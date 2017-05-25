import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { CoinComponent } from './coin.component';
import { CoinRoutingModule } from './coin-routing.module';
import { CountoModule } from 'angular2-counto';
import { ShowChoiceComponent } from './show-choice/show-choice.component';
import { GotComponent } from './got/got.component';
import { CriminalMindsComponent } from './criminal-minds/criminal-minds.component';
import { ThirteenReasonsWhyComponent } from './thirteen-reasons-why/thirteen-reasons-why.component';
import { BigBangTheoryComponent } from './big-bang-theory/big-bang-theory.component';

@NgModule({
    imports: [
        CoinRoutingModule,
        ChartsModule,
        CountoModule
    ],
    declarations: [CoinComponent, ShowChoiceComponent, GotComponent, CriminalMindsComponent, ThirteenReasonsWhyComponent, BigBangTheoryComponent]
})
export class CoinModule { }
