angular.module('testPortalApp').factory('summaryModel', () => {
    var summaryOutputStatuses = ['passed','failed','skipped','pending','total','empty'];
    return {
        statusSummary: (statuses, type) => {
            var summary = {}
            summaryOutputStatuses.forEach(os => summary[os] = statuses.filter(s=>s==os).length);
            summary.total = statuses.length;
            summary.type = type;
            return summary;
        },
        aggregateSummary: (summaries, type) => {
            var result = {}
            summaryOutputStatuses.forEach(os => result[os] = summaries.reduce((i, summary)=>summary[os] + i, 0));
            result.type = type;
            return result;
        },
        aggregateStatus: (summary) => {
            return summary.passed + summary.empty == summary.total
                    ? 'passed'
                    : summary.failed > 0
                        ? 'failed'
                        : summary.pending > 0
                            ? 'pending'
                            : 'skipped';
        }
    }
});