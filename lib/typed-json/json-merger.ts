import {IJSONMerger} from "./i-json-merger";
import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";
import {ITypedJSON} from "./i-typed-json";
import {IJSONValue} from "./i-json-value";

export class JSONMerger implements IJSONMerger {
    constructor(
        private collections:ICollections,
        private typedJSON:ITypedJSON
    ) {}

    mergeJSON(json1:IJSONValue, json2:IJSONValue):IJSONValue {
        var result = null;
        if(this.typedJSON.isJSON(json2)){
            result = {} ;
            if(this.typedJSON.isJSON(json1)){
                for(var key in <any> json1){
                    result[key] = json1[key] ;
                }
            }
            for(var key in <any> json2){
                if(typeof result[key] === "object" && typeof json2 === "object"){
                    result[key] = this.mergeJSON(result[key], json2[key]) ;
                }else{
                    result[key] = json2[key] ;
                }
            }
        } else if(Array.isArray(json1) && Array.isArray(json2)){
            result = json1 ;

            const list1:IList<any> = this.collections.newList(json1);
            const list2:IList<any> = this.collections.newList(json2);

            const duplicateIds = list1
                .map(l=>l.id)
                .filter(i=>i!=null)
                .intersectionWith(
                    list2
                        .map(l=>l.id)
                        .filter(i=>i!=null)
                );

            if(duplicateIds.notEmpty){
                throw new Error(`Duplicate ids found in configuration: ${duplicateIds.join(',')}`);
            }

            for(var i = 0; i < json2.length; i++){
                if(result.indexOf(json2[i]) === -1){
                    result[result.length] = json2[i] ;
                }
            }
        } else {
            result = json2 ;
        }

        return result ;
    }

}