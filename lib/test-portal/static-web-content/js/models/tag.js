angular.module('testPortalApp').factory('tag', function() {
    function isJIRA(tagName) { return tagName.indexOf('@SPYG-')>=0 }
    function jiraURL(tagName) { return `https://maprdrill.atlassian.net/browse/${tagName.substring(1)}` }
    function Tag(tagName) {
        return {
            name: tagName,
            isJIRA: isJIRA(tagName),
            href: isJIRA(tagName)
                ? jiraURL(tagName)
                : null
        }
    }
    return {
        fromJSON: function(tagJSON) {
            return Tag(tagJSON.name);
        },
        fromName: Tag
    }
});