export function deprecated(messageForWhatToUseInstead?:string) {
    const keysForWhichWarningHasAlreadyOccurred = [];

    return function(target: any, propertyKey: string, descriptor:TypedPropertyDescriptor<any>) {
        function printWarning(kindOfDeprecatedItem) {
            if(keysForWhichWarningHasAlreadyOccurred.indexOf(propertyKey) == -1) {
                keysForWhichWarningHasAlreadyOccurred.push(propertyKey);
                const message = messageForWhatToUseInstead && messageForWhatToUseInstead.trim() != ''
                    ? messageForWhatToUseInstead
                    : 'No advice or message provided by developer.';
                console.warn(`WARN: Deprecated ${kindOfDeprecatedItem} "${propertyKey}" was called. ${message}`);
            }
        }

        const originalGetFunction = descriptor.get;
        if(originalGetFunction) descriptor.get = function() {
            printWarning('getter');
            return originalGetFunction.call(this);
        };

        const originalSetFunction = descriptor.set;
        if(originalSetFunction) descriptor.set = function(value) {
            printWarning('setter');
            return originalSetFunction.call(this, value);
        };

        const originalValue = descriptor.value;
        if(originalValue) descriptor.value = function() {
            printWarning('method');
            return originalValue.apply(this, arguments);
        };
    };
}