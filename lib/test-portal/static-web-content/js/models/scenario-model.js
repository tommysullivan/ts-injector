angular.module('testPortalApp').factory('scenarioModel', (stepModel, summaryModel) => {
   return {
       fromJSON: (scenarioJSON) => {
           var steps = (scenarioJSON.steps || []).filter(s=>!s.hidden).map(stepModel.fromJSON);
           var summary = summaryModel.statusSummary(steps.map(s=>s.status), 'steps');
           return {
               name: scenarioJSON.name,
               tags: scenarioJSON.tags,
               tagNames: scenarioJSON.tags.map(tag => tag.name),
               keyword: scenarioJSON.keyword,
               steps: steps,
               summary: summary,
               status: summaryModel.aggregateStatus(summary)
           }
       }
   }
});