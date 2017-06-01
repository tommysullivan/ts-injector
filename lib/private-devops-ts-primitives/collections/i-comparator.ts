export interface IComparator<T> {
    (a:T, b:T):number;
}