module.exports = function() {
    return {
        //enable tests to run against a custom IP
        //use a DSL in the manual tests to describe what the manual tester should do and what results should be recorded
        //when running, mark the steps as pending via callback.pending() but also write JSON describing the manual tests to the result JSON using content-type application/json
        //html generator can generate results html that gives HTML controls that bind to the JSON object for manual steps. one can update
        //the page and save the corresponding JSON at any time. the JSON can be versioned in a RESTful JSON Database
        //and then we can easily query over it.
        //we can also serve up a page which allows one to create a new test run, specifying either a JQL or tags or both with which to run the tests.
        //we should also save information about the cluster under test that is not explicitly in the gherkin output itself
    }
}