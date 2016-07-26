/**
 * Created by Damith on 6/10/2016.
 */
// var routerApp = angular.module('digin-entry', ['ngMaterial','ngAnimate', 'ui.router', 'uiMicrokernel', 'configuration'
//     , 'ngToast', 'ngSanitize', 'ngMessages','ngAria']);

var routerApp = angular.module('digin-entry', ['ngMaterial','ngAnimate', 'ui.router', 'configuration'
    , 'ngToast', 'ngSanitize', 'ngMessages','ngAria']);


routerApp
    .config(["$httpProvider", "$stateProvider", "$urlRouterProvider",
        function ($httpProvider, $stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/signin');
            $stateProvider
                .state("signin", {
                    url: "/signin",
                    controller: "signin-ctrl",
                    templateUrl: "partial-signin.php",
                    data: {
                        requireLogin: false
                    }
                })
                .state("signup", {
                    url: "/signup",
                    controller: "signup-ctrl",
                    templateUrl: "partial-signup.php",
                    data: {
                        requireLogin: false
                    }
                })
                .state("password", {
                    url: "/password",
                    controller: "signin-ctrl",
                    templateUrl: "partial-forgerPw.php",
                    data: {
                        requireLogin: false
                    }
                })

        }]);

routerApp
    .controller("signin-ctrl", ['$scope', '$http', '$window', '$state',
        '$rootScope', 'focus', 'ngToast', 'Digin_Auth','Digin_Domain','$mdDialog','Local_Shell_Path','IsLocal',
        function ($scope, $http, $window, $state, $rootScope, focus, ngToast, Digin_Auth,Digin_Domain,$mdDialog,Local_Shell_Path,IsLocal) {

            $scope.signindetails = {};
            $scope.isLoggedin = false;

            $scope.error = {
                isUserName: false,
                isPwd: false,
                event: 0,
                isLoading: false
            };

            $scope.signup = function () {
                $scope.isLoggedin = false;
                $state.go('signup');
            };

            $scope.onClickSignUp = function () {
                $state.go('signup');
            };

            $scope.onClickSignIn = function () {
                $state.go('signin');
            };

            $scope.onClickForgetPw = function () {
                $state.go('password');
            };

            var mainFun = (function () {
                return {
                    fireMsg: function (msgType, content) {
                        ngToast.dismiss();
                        var _className;
                        if (msgType == '0') {
                            _className = 'danger';
                        } else if (msgType == '1') {
                            _className = 'success';
                        }
                        ngToast.create({
                            className: _className,
                            content: content,
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true,
                            animation: 'slide',
                            dismissOnClick: 'true'
                        });
                    }
                }
            })();

            $scope.login = function () {
                displayProgress();
                $http({
                    method: 'POST',
                    url: 'http://'+Digin_Domain+'/apis/authorization/userauthorization/login',
                    //url: '/apis/authorization/userauthorization/login',
                    headers: {'Content-Type': 'application/json'},
                    data: $scope.signindetails
                }).success(function (data) {
                    if (data.Success === true) {
                        if(IsLocal==false) { 
                            //#Added for live servers ------------------------------
                            $window.location.href = "/s.php?securityToken=" + data.Data.SecurityToken;
                        }  
                        else{
                            //#Added for local host ------------------------------
                             document.cookie = "securityToken=" + data.Data.SecurityToken + "; path=/";
                             document.cookie = "authData=" + encodeURIComponent(JSON.stringify(data.Data.AuthData)) + "; path=/";
                             window.location.href = Local_Shell_Path; //#got from config.js in entry/assets/js/config.js  (ex:"http://localhost:8080/git/digin/shell")
                        }
                    }
                    else {
                        $mdDialog.hide();
                        if(data.Message=="Email Address is not varified."){
                        mainFun.fireMsg('0', "This email address is not verified, Please verify your email...!");
                        }else{
                            mainFun.fireMsg('0', data.Message);
                        }
                    }
                }).error(function (data) {
                    console.log(data);
                    $mdDialog.hide();
                    mainFun.fireMsg('0', data.Message);
                });
            };


            //#pre-loader progress - with message
            var displayProgress = function (message) {
                $mdDialog.show({
                    template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>'+message+'</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
                    , parent: angular.element(document.body)
                    , clickOutsideToClose: false
                });
            };

            //#pre-loader progress - without message
            var displayProgress = function () {
                $mdDialog.show({
                    template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="column" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' +  '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
                    , parent: angular.element(document.body)
                    , clickOutsideToClose: false
                });
            };


            //#pre-loader error
            var displayError = function (message) {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process fail !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
            };

            //#pre-loader success
            var displaySuccess = function (message) {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process Completed !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
            };




            //#load forgot password
            $scope.validateEmail=function(){
                if($scope.email==undefined){
                    mainFun.fireMsg('0', 'Email can not be a blank...!');
                    return false;
                }
                else{
                    displayProgress("Change password processing...")
                    $scope.ChangePassword();
                }
                return true;
            };

             $scope.ChangePassword=function(){
                $http.get('http://'+Digin_Domain+'/auth/GetUser/'+$scope.email)
                    .success(function(response){
                        if(response.Error){
                            $mdDialog.hide();
                            mainFun.fireMsg('0', '<strong>Error : </strong>Invalid email address/ this email address not exist...!');
                            //displayError('Invalid email address/ this email address not exist...');
                            
                        }
                        else{
                            $scope.sendMail();
                        }   
                    }).error(function(error){  
                        $mdDialog.hide(); 
                        mainFun.fireMsg('0', '<strong>Error : </strong>Please try again...!');
                    });  
            };

            $scope.sendMail=function(){
                $http.get('http://'+Digin_Domain+'/apis/authorization/userauthorization/forgotpassword/'+$scope.email)
                //http://digin.io/apis/authorization/userauthorization/forgotpassword/chamila@duosoftware.com
                .success(function(response){
                    if(response.Success){
                        console.log(response);
                        $mdDialog.hide();
                        mainFun.fireMsg('1', "succussfully reset your password, Please check your mail for new password...!");
                        //displaySuccess('uccussfully reset your password, Please check your mail for new password...');
                        $scope.email='';
                        $state.go('signin');
                    }
                    else{
                        console.log(response);
                        $mdDialog.hide();
                        fireMsg('0', response.Message);
                    }
                }).error(function(error){  
                    $mdDialog.hide(); 
                    mainFun.fireMsg('0', error);
                });     
            };

           

    }])

    .directive('keyEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.keyEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .factory('focus', function ($timeout, $window) {
        return function (id) {
            $timeout(function () {
                var element = $window.document.getElementById(id);
                console.log(element);
                if (element)
                    element.focus();
            });
        };
    });


// ------------------------------------------------------------------------
//#signup controller
routerApp
    .controller('signup-ctrl', ['$scope', '$http', '$state', 'focus',
        'Digin_Domain', 'Digin_Engine_API','ngToast','$mdDialog','$location',
        function ($scope, $http, $state, focus,
                  Digin_Domain, Digin_Engine_API, ngToast,$mdDialog,$location) {

            $scope.onClickSignIn = function () {
                $scope.isLoggedin = false;
                $scope.freeze=false;
                $state.go('signin');
            };

            var delay = 2000;
            $scope.User_Name = "";
            $scope.User_Email = "";

            var signUpUsr = {
                firstName: '',
                lastName: '',
                email: '',
                pwd: '',
                cnfrPwd: ''
            };
            $scope.signUpUsr = signUpUsr;
            $scope.regex = {
                email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                number: /^\d+$/
            };

            $scope.error = {
                isFirstName: false,
                isLastName: false,
                isEmail: false,
                isPassword: false,
                isRetypeCnfrm: false,
                isLoading: false
            };

            //-----invite user - Signup-----------
            var email = ($location.search()).email;
            $scope.freeze=false;
            if(email==undefined){
                $scope.freeze=false;
            }
            else{
                signUpUsr.email=email;
                $scope.freeze=true;
            }
            //------------------------------------

            
            //#pre-loader progress
            var displayProgress = function (message) {
                $mdDialog.show({
                    template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>'+message+'</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
                    , parent: angular.element(document.body)
                    , clickOutsideToClose: false
                });
            };

            var mainFun = (function () {
                return {
                    fireMsg: function (msgType, content) {
                        ngToast.dismiss();
                        var _className;
                        if (msgType == '0') {
                            _className = 'danger';
                        } else if (msgType == '1') {
                            _className = 'success';
                        }
                        ngToast.create({
                            className: _className,
                            content: content,
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true,
                            animation: 'slide',
                            dismissOnClick: 'true'
                        });
                    },
                    validationClear: function () {
                        $scope.error = {
                            isFirstName: false,
                            isLastName: false,
                            isEmail: false,
                            isDomainName: false,
                            isPassword: false,
                            isRetypeCnfrm: false
                        };
                    },

                    dataClear: function () {
                        signUpUsr.firstName = '';
                        signUpUsr.lastName = '';
                        signUpUsr.email = '';
                        signUpUsr.pwd = '';
                        signUpUsr.cnfrPwd = '';
                        $scope.freeze=false;
                    },

                    validateEmail: function (email) {
                        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return re.test(email);
                    },

                    signUpUser: function () {
                        var fullname = signUpUsr.firstName + " " + signUpUsr.lastName;
                        $scope.user = {
                            "EmailAddress": signUpUsr.email,
                            "Name": fullname,
                            "Password": signUpUsr.pwd,
                            "ConfirmPassword": signUpUsr.cnfrPwd
                            //,
                            //"Domain": signUpUsr.firstName + "." + Digin_Domain
                        };
                        $scope.error.isLoading = true;
                        $http({
                            method: 'POST',
                            url: 'http://'+Digin_Domain+'/apis/authorization/userauthorization/userregistration',
                            //url: '/apis/authorization/userauthorization/userregistration',
                            data: angular.toJson($scope.user),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).success(function (data, status) {
                            //*Create Data Set
                            //$scope.createDataSet(signUpUsr.email, signUpUsr.firstName);

                            $scope.error.isLoading = false;
                            //$state.go('signin');

                            if (data.Success === false) {
                                $mdDialog.hide();
                                if(data.Message=="Already Registered."){
                                    mainFun.fireMsg('0','This email address you entered is already registered, Please try again...!');
                                }else{
                                    mainFun.fireMsg('0',data.Message);
                                }                               
                            }
                            else {
                                $mdDialog.hide();
                                mainFun.fireMsg('1', 'You are succussfully registerd, Please check your email for verification...!');
                                mainFun.dataClear();
                            }
                        }).error(function (data, status) {
                            $scope.error.isLoading = false;
                            $mdDialog.hide();
                            mainFun.fireMsg('0', 'Please Try again !!');
                        });
                    },
                }
            })();


            $scope.submit = function () {
                mainFun.validationClear();
                console.log(signUpUsr);
                //*validation
                if (signUpUsr.firstName == '' || angular.isUndefined(signUpUsr.firstName)) {
                    mainFun.fireMsg('0', '<strong>Error : </strong>First name is required..');
                    $scope.error.isFirstName = true;
                    focus('firstName');
                    return;
                } else if (signUpUsr.lastName == '' || angular.isUndefined(signUpUsr.lastName)) {
                    mainFun.fireMsg('0', '<strong>Error : </strong>Last name is required..');
                    $scope.error.isLastName = true;
                    focus('lastName');
                    return;
                }
                else if (signUpUsr.email == '' || angular.isUndefined(signUpUsr.email)) {
                    mainFun.fireMsg('0', '<strong>Error : </strong>Email address is required..');
                    $scope.error.isEmail = true;
                    focus('email');
                    return;
                }
                else if (!mainFun.validateEmail(signUpUsr.email)) {
                    mainFun.fireMsg('0', '<strong>Error : </strong>Invalid email address is required..');
                    $scope.error.isEmail = true;
                    focus('email');
                    return;
                }
                else if (signUpUsr.pwd == '' || angular.isUndefined(signUpUsr.pwd)) {
                    mainFun.fireMsg('0', '<strong>Error : </strong>Password is required..');
                    $scope.error.isPassword = true;
                    focus('password');
                    return;
                }
                else if (signUpUsr.pwd != signUpUsr.cnfrPwd) {
                    mainFun.fireMsg('0', '<strong>Error : </strong>Password not match..');
                    $scope.error.isPassword = true;
                    $scope.error.isRetypeCnfrm = true;
                    focus('cnfrmPwd');
                    return;
                }
                else {
                    displayProgress('User registration is processing...');
                    mainFun.signUpUser();
                    //return;

                }
            };


            //Go to terms and conditon page
            $scope.isLoadTermCondition = false;
            $scope.goToTermCondition = function (state) {
                $scope.isLoadTermCondition = state;
            };



        }
    ]);


//*Password verification
routerApp.directive('passwordVerify', function () {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(function () {
                var combined;
                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function (value) {
                if (value) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
}).factory('focus', function ($timeout, $window) {
    return function (id) {
        $timeout(function () {
            var element = $window.document.getElementById(id);
            console.log(element);
            if (element)
                element.focus();
        });
    };
});


