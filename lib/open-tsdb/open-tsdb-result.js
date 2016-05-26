"use strict";
var OpenTSDBResult = (function () {
    function OpenTSDBResult(soughtTags, metricName, resultJSONArray, collections, typedJSON) {
        this._soughtTags = soughtTags;
        this.metricName = metricName;
        this.resultJSONArray = resultJSONArray;
        this.collections = collections;
        this.typedJSON = typedJSON;
    }
    Object.defineProperty(OpenTSDBResult.prototype, "typedJSONResult", {
        get: function () {
            return this.typedJSON.newJSONObject(this.resultJSONArray[0]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTSDBResult.prototype, "numberOfEntries", {
        get: function () {
            return this.timestamps.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTSDBResult.prototype, "metric", {
        get: function () {
            return this.metricName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTSDBResult.prototype, "soughtTags", {
        get: function () {
            return this._soughtTags;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTSDBResult.prototype, "tags", {
        get: function () {
            return this.typedJSONResult.listNamed('tags');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTSDBResult.prototype, "timestamps", {
        get: function () {
            var firstResult = this.resultJSONArray[0];
            return firstResult == null
                ? this.collections.newEmptyList()
                : this.typedJSONResult.dictionaryNamed('dps').keys;
        },
        enumerable: true,
        configurable: true
    });
    OpenTSDBResult.prototype.toString = function () {
        return JSON.stringify({
            metric: this.metric,
            soughtTags: this.soughtTags.toJSON(),
            rawResultJSON: this.resultJSONArray
        }, null, 3);
    };
    return OpenTSDBResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenTSDBResult;
//# sourceMappingURL=open-tsdb-result.js.map