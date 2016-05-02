/**
 * Created by kvosoughi on 4/11/16.
 */

'use strict';

/**
 * @name Pie3dChart
 * @description
 * Directive of the Automated Test Explorer for Rendering Pie3D Chart
 */

testPortalApp.directive("pie3dchart", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/pie3dchart.html',
        scope: {
            chartid: '=',
            chartdata: '='
        },
        controller: function($scope,$rootScope) {
            $scope.createChart = function(data) {
                $('#'+$scope.chartid).highcharts({
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    colors: ['red', 'green', 'yellow', 'gray'],
                    height: 250,
                    title: {
                        text: 'Test Summary'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            depth: 35,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Test Summary',
                        data: data
                    }]
                });
            }

            $scope.normalizeData = function(summarydata) {
                let data = summarydata.data,
                    labels = summarydata.labels,
                    normdata = [];

                labels.forEach((value, index) => {
                    if(index ==2) {
                        normdata.push({
                            name: value,
                            y: data[index],
                            sliced: true,
                            selected: true
                        });
                    } else {
                        normdata.push([value,data[index]]);
                    }
                });
                return normdata;
            };

            $rootScope.$on('applydata', (event, data)=> {
                $scope.chartdata = $scope.normalizeData(data.summaryPieChart);
                $scope.createChart($scope.chartdata);
            });
        },
        link: (scope, element, attrs, ctrl) => {
            // TO-DO Add Listeners
        }
    }
});
