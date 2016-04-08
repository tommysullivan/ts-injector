import IList from "./i-list";
import IDictionary from "./i-dictionary";

interface ICollections {
    newList<T>(items:Array<T>):IList<T>;
    newEmptyList<T>():IList<T>;
    newDictionary<T>(initialHash:Object):IDictionary<T>;
    newEmptyDictionary<T>():IDictionary<T>;
}

export default ICollections;
