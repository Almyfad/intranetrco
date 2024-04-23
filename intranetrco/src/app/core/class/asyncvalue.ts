import { Observable, concat, map, of } from "rxjs";

 class AsyncValue<T> {
    pending: boolean = true;
    value: T | undefined = undefined;
    constructor(value: T | undefined = undefined) {
        if (value === undefined) return;
        this.value = value;
        this.pending = false;
    }

    static list<T>(count: number): AsyncValue<T>[] {
        let list = [];
        for (let i = 0; i < count; i++) {
            list.push(new AsyncValue<T>());
        }
        return list;
    }
    static oflist<T>(count: number): Observable<AsyncValue<T>[]> {
        return of(AsyncValue.list<T>(count));
    }
    static of<T>(obs: Observable<T[]>, count:number):  Observable<AsyncValue<T>[]> {
        let defaultn = AsyncValue.oflist<T>(count);
        let result = obs.pipe(map((values: T[]) => {
            return values.map(value => new AsyncValue(value));
        }));
        return concat(defaultn, result);
    }

}

export { AsyncValue };
