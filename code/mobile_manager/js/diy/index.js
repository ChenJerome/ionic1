var indexApp = angular.module("indexApp", ['ngRoute', 'communityDirectives', 'indexControllers', 'loginService']);
indexApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/aaa",{
        template:"<h1>内容部分</h1>"
    }).when("/index",{
        templateUrl:"index.html"
    }).otherwise({
        template:"<h2>这个是默认的模板哦</h2>"
    });
}]);