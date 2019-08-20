(function () {
	'use strict';
	
	var login = angular.module('CafeApp.login', ['ngRoute']);

	login
        .controller('LoginScreenHeaderController', LoginScreenHeaderController)
        .controller('LoginScreenController', LoginScreenController);
	
	LoginScreenHeaderController.$inject = ['$scope', 'PageTitleService'];
    function LoginScreenHeaderController($scope, PageTitleService) {
        var header = this;
        var pageTitle = "Login";

        isFooterVisible = true;
        $scope.isFooterVisible = isFooterVisible;

        header.title = PageTitleService.title(pageTitle + " - ");//.split(" - ")[0];
        // if (header.title.split(" - ").size > 0) {
            header.title = header.title.split(" - ")[0];
        // }
    }

	LoginScreenController.$inject = ['$http', 'URL'];
    function LoginScreenController($http, URL) {
        var loginScreen = this;
		
		mobileNumber = loginScreen.mobileNumber;
		
		loginScreen.login = function () {
			$http({
				method: "POST",
				url: URL,
				param: {mobile: loginScreen.mobileNumber}
			}).then(
				function (success) {
					console.log("data:", success.data);
				},
				function (error) {
					console.log("error:", error.msg);
				});
		}
    }
})();