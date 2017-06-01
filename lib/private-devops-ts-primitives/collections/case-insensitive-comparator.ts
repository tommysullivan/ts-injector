export function CaseInsensitiveComparator(a:string, b:string):number {
    return a.toLowerCase().localeCompare(b.toLowerCase());
}