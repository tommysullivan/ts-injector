angular.module('testPortalApp').factory('pieChart', (summaryModel, statusesModel) => {
    return {
        forSummary: function(summaryModel) {
            return {
                labels: statusesModel.allStatuses.map(s=>statusesModel.statusDisplayName(s.name)),
                data: statusesModel.allStatuses.map(s=>summaryModel[s.name]),
                colours: statusesModel.allStatuses.map(s=>s.color)
            }
        }
    }
});