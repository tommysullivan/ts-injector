/**
 * Created by kvosoughi on 4/11/16.
 */

'use strict';

/**
 * @name StackedBarChart
 * @description
 * Directive of the Automated Test Explorer for Rendering Stacked Bar Chart
 */

testPortalApp.directive("stackedbarchart", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/stackedbarchart.html',
        scope: {
            chartid: '=',
            chartdata: '='
        },
        controller: function($scope,$rootScope) {
            $scope.createChart = function(data) {
                $('#'+$scope.chartid).highcharts({
                    chart: {
                        type: 'column'
                    },
                    height: 250,
                    colors: ['red', 'green', 'yellow', 'gray'],
                    title: {
                        text: 'Stacked Test Results'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total Test Results'
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'right',
                        x: -30,
                        verticalAlign: 'top',
                        y: 25,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                style: {
                                    textShadow: '0 0 3px black'
                                }
                            }
                        }
                    },
                    series: data.series
                });
            }

            $scope.normalizeData = function(chartdata) {
                let data = chartdata.data,
                    colours = chartdata.colours,
                    labels = chartdata.labels,
                    series = chartdata.series,
                    times = chartdata.times,
                    categories = [],
                    normdata = [];

                times.forEach((value, index) => {
                    categories.push(new Date(value));
                });

                series.forEach((value, seriesIndex) => {
                    normdata.push({
                        name: value,
                        data: data[seriesIndex]
                    });
                });
                return {
                    series: normdata,
                    categories: categories
                };
            };

            $rootScope.$on('applydata', (event, data)=> {
                $scope.chartdata = $scope.normalizeData(data.testResultStatusesOverTimeChart);
                $scope.createChart($scope.chartdata);
            });
        },
        link: (scope, element, attrs, ctrl) => {
            // TO-DO Add Listeners
        }
    }
});


