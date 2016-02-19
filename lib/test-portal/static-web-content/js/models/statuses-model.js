angular.module('testPortalApp').factory('statusesModel', () => {
    return [
        { name: 'failed', selected: true, prefix: '✘', color: '#FF0000'},
        { name: 'passed', selected: true, prefix: '✓', color: '#00FF00' },
        { name: 'pending', selected: true, prefix: '- [pending]', color: '#FFFF00' },
        { name: 'notExecuted', selected: true, displayValue: 'not executed', prefix: '- [not executed]', color: '#AAAAAA' }
    ]
});