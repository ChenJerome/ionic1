var communityDirectives = angular.module('communityDirectives', []);
communityDirectives.directive('loginDialog', function() {
	return {
		restrict : 'EA',
		templateUrl : 'templates/loginDialog.html'
	}
});