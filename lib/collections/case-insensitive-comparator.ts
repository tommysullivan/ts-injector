export default function compare(a:string, b:string):number {
    return a.toLowerCase().localeCompare(b.toLowerCase());
}