var summaryOutputStatuses = ['passed','failed','skipped','pending','total'];

function statusSummary(statuses, type) {
    var summary = {}
    summaryOutputStatuses.forEach(os => summary[os] = statuses.filter(s=>s==os).length);
    summary.total = statuses.length;
    summary.type = type;
    return summary;
}

function aggregateSummary(summaries, type) {
    var result = {}
    summaryOutputStatuses.forEach(os => result[os] = summaries.reduce((i, summary)=>summary[os] + i, 0));
    result.type = type;
    return result;
}

function aggregateStatus(summary) {
    return summary.passed == summary.total && summary.total > 0
        ? 'passed' : summary.failed > 0 ? 'failed' : summary.skipped > 0 ? 'skipped' : 'pending';
}