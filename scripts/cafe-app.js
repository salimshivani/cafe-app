(function () {
    'use strict';
    
    var cafeApp = angular.module('CafeApp', []);

    cafeApp
        .controller('TitleController', TitleController)
        .controller('HomeScreenHeaderController', HomeScreenHeaderController)
        .controller('HomeScreenController', HomeScreenController)
        .controller('LoginScreenHeaderController', LoginScreenHeaderController)
        .controller('LoginScreenController', LoginScreenController)
        .controller('SignUpScreenHeaderController', SignUpScreenHeaderController)
        .controller('SignUpScreenController', SignUpScreenController)
		.controller('FooterController', FooterController)
        .factory('PageTitleService', PageTitleService);
	
	var email = '', mobileNumber = '', name = '';
	
	var isFooterVisible = false;

    TitleController.$inject = ['PageTitleService'];
    function TitleController(PageTitleService) {
        var title = this;

        title.pageTitle = PageTitleService.title;
    }

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

    LoginScreenHeaderController.$inject = ['$scope', 'PageTitleService'];
    function LoginScreenHeaderController($scope, PageTitleService) {
        var header = this;
        var pageTitle = "Login";

        isFooterVisible = true;
        $scope.isFooterVisible = isFooterVisible;

        header.title = PageTitleService.title(pageTitle + " - ");//.split(" - ")[0];
        if (header.title.split(" - ").size > 0) {
            header.title = header.title.split(" - ")[0];
        }
    }

    function LoginScreenController() {
        var loginScreen = this;
    }

    SignUpScreenHeaderController.$inject = ['$scope', 'PageTitleService'];
    function SignUpScreenHeaderController($scope, PageTitleService) {
        var header = this;
        var pageTitle = "Sign Up";

        isFooterVisible = true;
        $scope.isFooterVisible = isFooterVisible;

        header.title = PageTitleService.title(pageTitle + " - ").split(" - ")[0];
    }

    function SignUpScreenController() {
        var signUpScreen = this;
    }
    
    FooterController.$inject = ['$scope']
	function FooterController ($scope) {
		var footer = this;
        
        $scope.isFooterVisible = isFooterVisible;
		footer.isVisible = $scope.isFooterVisible;
	}

    function PageTitleService() {
        var pageTitle = this;
        
        pageTitle.title = 'Cafe App';

        return {
            title: function (title) {
                if (title === undefined || title === '') {
//                    pageTitle.title;
                    return pageTitle.title;
                } else if (title.includes(" - ")) {
                    pageTitle.title = title.concat(pageTitle.title);
                    console.log("pageTitle", pageTitle.title);
                    return pageTitle.title;
                } else {
                    pageTitle.title = title;
                    return pageTitle.title;
                }
            }
        };
    }
})();