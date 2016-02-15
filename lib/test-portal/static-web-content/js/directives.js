var testPortalApp = angular.module('testPortalApp');

function templateUrl(directiveFileNameWithoutExtension) {
    return `directives/${directiveFileNameWithoutExtension}.html`;
}

function directiveFactory(directiveFileNameWithoutExtension) {
    return () => {
        return {
            templateUrl: templateUrl(directiveFileNameWithoutExtension),
            scope: false
        }
    }
}

testPortalApp.directive('testResult', directiveFactory('test-result'));
testPortalApp.directive('tableOfContents', directiveFactory('table-of-contents'));
testPortalApp.directive('feature', directiveFactory('feature'));
testPortalApp.directive('scenario', directiveFactory('scenario'));
testPortalApp.directive('step', directiveFactory('step'));
testPortalApp.directive('anchorLink', () => {
    return {
        templateUrl: templateUrl('anchor-link'),
        scope: {
            content: '@',
            onAnchorClick: '&'
        }
    }
});
testPortalApp.directive('summary', () => {
    return {
        templateUrl: templateUrl('summary'),
        scope: {
            summaryModel: '='
        }
    }
});