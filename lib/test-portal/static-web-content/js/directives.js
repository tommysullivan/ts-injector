var testPortalApp = angular.module('testPortalApp');

function templateUrl(directiveFileNameWithoutExtension) {
    return `views/${directiveFileNameWithoutExtension}.html`;
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
testPortalApp.directive('navigation', directiveFactory('navigation'));
testPortalApp.directive('queryToolbar', directiveFactory('query-toolbar'));
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
            summaryModel: '&'
        }
    }
});
testPortalApp.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
});