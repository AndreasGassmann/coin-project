import {NgModule} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import {CoinComponent} from './coin.component';
import {ShowChoiceComponent} from "./show-choice/show-choice.component";
import {ThirteenReasonsWhyComponent} from "./thirteen-reasons-why/thirteen-reasons-why.component";
import {GotComponent} from "./got/got.component";
import {CriminalMindsComponent} from "./criminal-minds/criminal-minds.component";
import {BigBangTheoryComponent} from "./big-bang-theory/big-bang-theory.component";

const routes: Routes = [
  {
    path: '',
    component: CoinComponent,
    data: {
      title: 'Coin'
    }
  },
  {
    path: '/show-choice',
    component: ShowChoiceComponent,
    data: {
      title: 'Coin'
    }
  },
  {
    path: '/thirteen-reasons-why',
    component: ThirteenReasonsWhyComponent,
    data: {
      title: 'Coin'
    }
  },
  {
    path: '/got',
    component: GotComponent,
    data: {
      title: 'Coin'
    }
  },
  {
    path: '/criminal-minds',
    component: CriminalMindsComponent,
    data: {
      title: 'Coin'
    }
  },
  {
    path: '/big-bang-theory',
    component: BigBangTheoryComponent,
    data: {
      title: 'Coin'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoinRoutingModule {
}
