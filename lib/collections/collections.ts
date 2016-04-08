import ICollections from "./i-collections";
import List from "./list";
import IList from "./i-list";
import Dictionary from "./dictionary";
import IDictionary from "./i-dictionary";

export default class Collections implements ICollections {
    newList<T>(items:Array<T>=[]):IList<T> {
        return new List<T>(items);
    }

    newEmptyList<T>():IList<T> {
        return this.newList<T>();
    }

    newDictionary<T>(initialItems:any):IDictionary<T> {
        return new Dictionary<T>(initialItems, this);
    }

    newEmptyDictionary<T>():IDictionary<T> {
        return new Dictionary<T>([], this);
    }
}