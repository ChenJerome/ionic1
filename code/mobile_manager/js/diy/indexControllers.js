var indexControllers = angular.module("indexControllers", []);
indexControllers.controller('loginController', ['$scope', '$routeParams', '$rootScope', 'loginService', 'UserInfoService', 'QuestionService', 'ArticleService',
    function($scope,$routeParams, $rootScope, loginService, UserInfoService, QuestionService, ArticleService){
		$scope.login = function(){
			loginService.login($scope.username, $scope.password).success(
				function(data){
					if(data.isLogin == "-2"){
						alert("密码不正确！")
					}else if(data.isLogin == "-3"){
						alert("用户名不存在！")
					} else if(data.isLogin == "0"){
						loginCallback();
					}else{
						alert("抱歉，登录异常！")
					}
				}
			);
   		}
   	}
])