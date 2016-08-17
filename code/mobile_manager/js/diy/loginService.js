var loginService = angular.module("loginService", []);
loginService.factory('loginService', ['$resource', function($resource) {
	
	return $resource( '/UEP-PUB/community/communityAction.do', {}, {
			login : {
				method : "POST",
				params:{
					action: 'getAllComments'
				},
				isArray : true
			},
			saveComment : {
				method : "POST",
				isArray : true
			}
		}
	);
	
} ])