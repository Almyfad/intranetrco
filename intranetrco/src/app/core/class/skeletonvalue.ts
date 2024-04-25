import { Observable, concat, map, of } from "rxjs";

 class SkeletonValue<T> {
    pending: boolean = true;
    value: T | undefined = undefined;
    constructor(value: T | undefined = undefined) {
        if (value === undefined) return;
        this.value = value;
        this.pending = false;
    }

    static list<T>(count: number): SkeletonValue<T>[] {
        let list = [];
        for (let i = 0; i < count; i++) {
            list.push(new SkeletonValue<T>());
        }
        return list;
    }
    static oflist<T>(count: number): Observable<SkeletonValue<T>[]> {
        return of(SkeletonValue.list<T>(count));
    }
    static of<T>(obs: Observable<T[]>, count:number):  Observable<SkeletonValue<T>[]> {
        let defaultn = SkeletonValue.oflist<T>(count);
        let result = obs.pipe(map((values: T[]) => {
            return values.map(value => new SkeletonValue(value));
        }));
        return concat(defaultn, result);
    }

}

export { SkeletonValue as SkeletonValue };
