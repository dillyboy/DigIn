routerApp.controller('myAccountCtrl',[ '$scope','$mdDialog', 'notifications', function ($scope,$mdDialog,notifications){ //,'DiginServices'
	
	$scope.$parent.currentView = "Settings";
	
	var userObject = {}; //if the user cancels editing replace $scope.user with this
	$scope.user = {};
	$scope.editModeOn = false;
	
	/*DiginServices.getProfile(function(data) {
		userObject = angular.copy(data);
		$scope.user = data;
	})*/
	
	//$scope.profile_pic = "images/settings/new_user.png";
	
	$scope.profile = (function () {
		return {
			clickEdit: function () {
				$scope.editModeOn = true;
			},
			changeUserProfile: function (){
				$scope.editModeOn = true;
				DiginServices.updateProfile($scope.user).then(function(result) {
					if(result.IsSuccess == true)
					{
						$scope.editModeOn = false;
						notifications.toast(1, "Profile Updated");
						userObject = $scope.user;
					}else{
						notifications.toast(0, result.Message);
					}
				})
			},
			cancel: function (){
				$scope.user = angular.copy(userObject);
				$scope.editModeOn = false;
			},
			changePassword: function (ev) {
				$mdDialog.show({
				  controller: "changePasswordCtrl",
				  templateUrl: 'views/settings/profile/change-password.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true
				})
				.then(function(answer) {
				})
			},
			uploadProfilePicture: function(ev)
			{
				$mdDialog.show({
				  controller: "uploadProfilePictureCtrl",
				  templateUrl: 'views/settings/profile/uploadProfilePicture.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true
				})
				.then(function(answer) {
				})
			},
			closeSetting: function () {
				$state.go('home');
			}
		};
    })();
	
	setTimeout(function(){
		Highcharts.chart('container_chart', {
			  title: {
				text: 'Bandwidth Usage'
			  },
			  chart: {
				type: "line"
				
				},

			  xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
				]
			  },

			  series: [{
				data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
			  }]
		});
	}, 1000);
	
	var vm = this;
	
	vm.companyPricePlans = [
		{
			id : "personal_space",
			name:"Personal Space",
			numberOfUsers:"1",
			storage: "10 GB",
			bandwidth: "100 GB",
			perMonth: "$10",
			perYear: "$10",
			per: "/ User",
			Description: "desc"
		},
		{
			id : "mini_team",
			name:"We Are A Mini Team",
			numberOfUsers:"5",
			storage: "10 GB",
			bandwidth: "100 GB",
			perMonth: "$8",
			perYear: "$6.99 ",
			per: "/ User",
			Description: "desc"
		},
		{
			id : "world",
			name:"We Are the World",
			numberOfUsers:"10",
			storage: "10 GB",
			bandwidth: "100 GB",
			perMonth: "$6",
			perYear: "$4.99",
			per: "/ User",
			Description: "desc"
		}];
	
	vm.paymentCards = [
		{
			last4: "8431",
			brand: "American Express",
			country: "US",
			exp_month: 5,
			exp_year: 2019
		},{
			last4: "8445",
			brand: "Visa",
			country: "US",
			exp_month: 6,
			exp_year: 2020
		}
	];
	
	vm.makeDefault = function()
	{
		console.log("make Default");
	}
	
}])

routerApp.controller('changePasswordCtrl',['$scope','$mdDialog','$http','DiginServices','notifications' ,function ($scope,$mdDialog,$http,DiginServices,notifications) {

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.submit = function()
  {
	   
        if ($scope.newPassword === $scope.confirmNewPassword) {

			DiginServices.changePassword($scope.oldPassword ,$scope.newPassword).then(function(result) {
				if(result.Error == false)
				{
					notifications.toast(1, "Passoword Changed");
					$mdDialog.hide(result);
				}else{
					notifications.toast(0, result.Message);
				}
			})

        } else {
            notifications.toast(0,"New Password Confirmation invalid");
        }
		//$mdDialog.hide($scope.email);
  }
}])

routerApp.controller('uploadProfilePictureCtrl',['$scope','$mdDialog','$http','notifications' ,function ($scope,$mdDialog,$http,notifications) {
	
	$scope.fileChanged = function(e)
	{
		if( !e ) e = window.event;
		var x = e.target||e.srcElement;
		
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			$scope.theImage1 = reader.result;
			$scope.$apply();
		};
		reader.readAsDataURL(file);
	}
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.submit = function()
	{
		var profileImg = document.getElementById('profileImg');
		var profileImgSrc = someimage.src;
		console.log(profileImgSrc);
	}
}])