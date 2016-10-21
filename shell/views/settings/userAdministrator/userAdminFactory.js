routerApp.factory('userAdminFactory', ['$rootScope','$http', '$v6urls', '$auth', 'notifications', function($rootScope,$http, $v6urls, $auth,notifications) {
	var cache = {};
	
	return {
       inviteUser: function(userEmail) {
			 notifications.startLoading("Inviting user, Please wait..");
             //return the promise directly.
			 //http://testfirst1t.qa.duoworld.com/auth/tenant/AddUser/chamila@duosoftware.com/user
             return $http.get('/auth/tenant/AddUser/' + userEmail + '/user', {
					headers: {'Securitytoken': JSON.parse(decodeURIComponent(getCookie('authData'))).SecurityToken}
				})
			   .then(function(result) {
					//return result.data;
					notifications.toast(1, "User Invited");
					notifications.finishLoading();
				},function errorCallback(response) {
					console.log(response);
					notifications.toast(0, "Falied to invite user");
					notifications.finishLoading();
			 });	
        }, getInvitedUsers: function(callback) {
				//if(cache.invitedUsers)
				//{
				//	callback(cache.invitedUsers);
				//}else{
					 ////return the promise directly.
					 return $http.get('/apis/usercommon/getSharableObjects')
					   .then(function(result) {
							////return result.data;
							 for (var i = 0, len = result.data.length; i<len; ++i) {
								if (result.data[i].Type == "User") {
									$rootScope.sharableUsers.push(result.data[i]);
								}else if (result.data[i].Type == "Group") {
									$rootScope.sharableGroups.push(result.data[i]);
								}
							}
							//cache.invitedUsers = result;
							//callback(cache.invitedUsers)
							
						},function errorCallback(response) {
							notifications.toast(0, "Falied to get users");
					 });	
				//}
		
		   }, getAllGroups: function(callback) {
				if(cache.allGroups)
				{
					callback(cache.allGroups);
				}else{
					 //return the promise directly.
					 return $http.get('/apis/usercommon/getAllGroups')
					   .then(function(result) {
							//return result.data;
							cache.allGroups = result.data;
							callback(cache.allGroups)
							
						},function errorCallback(response) {
							notifications.toast(0, "Falied to get all groups");
					 });	
				}
		
		   }, addUserGroup: function(userGroup) {
				//notifications.startLoading("Adding User Group, Please wait..");
				var req = {
					method: "POST",
					url: "/apis/usercommon/addUserGroup",
					headers: {
						"Content-Type": "application/json"
						//"SecurityKey" : $auth.getSecurityToken()
					},
					data: userGroup
				}
				 return $http(req)
					.then(function(result){
						//notifications.finishLoading();
						console.log(result);
						return result.data;
						
						
					},function errorCallback(response) {
						notifications.toast(0, "Falied to add group");
						notifications.finishLoading();
				});	
		
		},removeUserGroup: function(groupId) {
			 return $http.get('/apis/usercommon/removeUserGroup/'+groupId) //jsons/everything.json
			   .then(function(result) {
					//resolve the promise as the data
					return result.data.Result;
				},function errorCallback(response) {
						console.log(response);
						notifications.toast(0, "Falied to remove user");
				 });
        },removeInvitedUser:function(email){
			
			//http://hxllnisqyomailinfo.staging.digin.io/auth/tenant/RemoveUser/juafbeblvexc@dropmail.me
			return $http.get('/auth/tenant/RemoveUser/'+email)
			   .then(function(result) {
					//resolve the promise as the data
					if(result.Error==true){
						return result.Message;
					}
					else
					{
						
					}

				},function errorCallback(response) {
						console.log(response);
						notifications.toast(0, "Falied to remove user");
				 });
		},getPackageDetail:function(SecurityToken){//#get package detail#//
			    $http.get('http://192.168.2.61:8080/packages?SecurityToken=62229efc0ec2029844a4a01184814b5b')
			    //$http.get('http://prod.digin.io:1929/packages?SecurityToken=62229efc0ec2029844a4a01184814b5b')
			    //$http.get(Digin_Engine_API + "packages?SecurityToken=" + getCookie('securityToken'))
		        .success(function(data) {
		            console.log(data.Result);
		            $rootScope.packageDetail=data.Result;
		        }).error(function() {
		            console.log("error");
		        });
		}
		
   }
}]);//END OF DiginServices