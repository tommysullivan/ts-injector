module.exports = function(api, cucumberCLITemplate) {
    return {
        runCukesForTags: function(arrayOfTagNamesWithoutAtSymbol) {
            var tagsString = arrayOfTagNamesWithoutAtSymbol.map(function(s) { return '@'+s; }).join(',');
            var command = cucumberCLITemplate.replace('${tags}', tagsString);
            console.log('Run the following command to execute cucumber tests:');
            console.log(command);
            console.log('');
            return command;
        }
    }
}