//damith
'use strict';

routerApp.controller('welcomeSearchBarCtl', function ($scope, $rootScope, $http, dynamicallyReportSrv,
                                                      Digin_Engine_API, Digin_Tomcat_Base, $state, Digin_Domain, ngToast) {

    var privateFun = (function () {
        var reqParameter = {
            apiBase: Digin_Engine_API,
            tomCatBase: Digin_Tomcat_Base,
            token: '',
            reportName: '',
            queryFiled: ''
        };
        var getSession = function () {
            reqParameter.token = getCookie("securityToken");
        };
        return {
            getAllDashboards: function () {
                  var userInfo=JSON.parse(decodeURIComponent(getCookie('authData')));

                $http({
                    method: 'GET',
                    url: Digin_Engine_API + 'get_all_components?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
                }).success(function (data) {
                        console.log("data getAllDashboards", data);
                        // for (var i = 0; i < data.Result.length; i++) {
                        //     $scope.dashboards.push(
                        //         {dashboardID: data.Result[i].compID, dashboardName: data.Result[i].compName}
                        //     );
                        // }
                    })
                    .error(function (error) {
                        console.log("error get dashboard...!");
                    });
            },
            getAllReports: function () {
                getSession();
                dynamicallyReportSrv.getAllReports(reqParameter).success(function (data) {
                    if (data.Is_Success) {
                        for (var i = 0; i < data.Result.length; i++) {
                            $scope.reports.push(
                                {name: data.Result[i], path: '/dynamically-report-builder'}
                            );
                        }
                    }
                }).error(function (respose) {
                    console.log('error request getAllReports...');
                });
            }
        }
    })();



    //pagination  option
    $scope.pageConfig = {
        itemsPerPage: 8,
        fillLastPage: true
    }


    //go dashboard
    $scope.goReport = function (report) {
        $state.go('home.DynamicallyReportBuilder', {'reportNme': report});
    }

    $scope.goDashboard = function (dashboard) {

        console.log("dash item", dashboard);

       var userInfo=JSON.parse(decodeURIComponent(getCookie('authData')));

        $http({
            method: 'GET',
            url: Digin_Engine_API + 'get_component_by_comp_id?comp_id=' + dashboard.dashboardID + '&SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
        })
            .success(function (data) {
                if (data.Is_Success) {
                    console.log("$scope.dashboardObject", $scope.dashboardObject);
                    $rootScope.dashboard = data.Result;
                    ngToast.create({
                        className: 'success',
                        content: data.Custom_Message,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                    $state.go('home.Dashboards');
                }
                else {

                    ngToast.create({
                        className: 'danger',
                        content: data.Custom_Message,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                    $mdDialog.hide();
                }
            })
            .error(function (error) {
                ngToast.create({
                    className: 'danger',
                    content: 'Failed retrieving Dashboard Details. Please refresh page to load data!',
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    dismissOnClick: true
                });
            });
    }

});