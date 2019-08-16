(function () {
	var signUp = angular.module('CafeApp.signUp', ['ngRoute']);

	signUp
        .controller('SignUpScreenHeaderController', SignUpScreenHeaderController)
        .controller('SignUpScreenController', SignUpScreenController);
	
	SignUpScreenHeaderController.$inject = ['$scope', 'PageTitleService'];
    function SignUpScreenHeaderController($scope, PageTitleService) {
        var header = this;
        var pageTitle = "Sign Up";

        isFooterVisible = true;
        $scope.isFooterVisible = isFooterVisible;

        header.title = PageTitleService.title(pageTitle + " - ").split(" - ")[0];
    }

	SignUpScreenController.$inject = ['$http'];
    function SignUpScreenController($http) {
        var signUpScreen = this;
		
		email = signUpScreen.email;
		mobileNumber = signUpScreen.mobileNumber;
		name = signUpScreen.name;
		password = signUpScreen.password;
		conPassword = signUpScreen.conPassword;
		
//		window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('login-button', {
//  			'size': 'invisible',
//  			'callback': function(response) {
//    			// reCAPTCHA solved, allow signInWithPhoneNumber.
//    			onSignInSubmit();
//  			}
//		});
		
		signUpScreen.login = function () {
			$http({
				method: "POST",
				url: URL,
				param: {mobile: loginScreen.mobileNumber}
			}).then(
				function (success) {
					console.log("data:", success.data);
					window.location = 'index.html';
				},
				function (error) {
					console.log("error:", error.msg);
				});
		}
    }
})();