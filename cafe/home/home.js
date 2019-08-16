(function () {
	var home = angular.module('CafeApp.home', ['ngRoute']);
	
	home
        .controller('HomeScreenHeaderController', HomeScreenHeaderController)
        .controller('HomeScreenController', HomeScreenController);
    
	HomeScreenHeaderController.$inject = ['$scope', 'PageTitleService'];
    function HomeScreenHeaderController($scope, PageTitleService) {
        var header = this, pageTitle = "Cafe App";

        header.title = PageTitleService.title(pageTitle);
        isFooterVisible = false;
        $scope.isFooterVisible = isFooterVisible;

		// if (mobileNumber !== '' && mobileNumber.length === 10) {
		// }
        // header.login = function () {
        // };
    }

    function HomeScreenController() {
        var homeScreen = this;
    }
	
})();