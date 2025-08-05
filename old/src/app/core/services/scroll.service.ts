import { Injectable } from '@angular/core';
import { BehaviorSubject, distinct, filter, map, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  scroll$$ = new BehaviorSubject<ScrollInfos | undefined>(undefined);

  onScroll(scrollInfos: ScrollInfos) {
    this.scroll$$.next(scrollInfos);
  }

  get scrollInfos$() {
    return this.scroll$$.asObservable();
  }

  get ScrollPercent$() {
    return this.scrollInfos$.pipe(
      map(x => {
        if (!x) {
          return 0;
        }
        return x.scrollTop / (x.scrollHeight - x.clientHeight) * 100;
      })
    );
  }


  get isOver80Percent$() {
    return this.ScrollPercent$.pipe(
      map(x => x > 80)
    );
  }

  get is80Reached$() {
    return this.isOver80Percent$.pipe(
      pairwise(),
      filter(([prev, curr]) => prev === false && curr === true),
      distinct(),
      map(() => true)
    );
  }

}

export class ScrollInfos {
  constructor(
    public scrollHeight: number,
    public scrollTop: number,
    public clientHeight: number
  ) { }
}
