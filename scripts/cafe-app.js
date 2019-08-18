(function () {
    'use strict';
    
    var cafeApp = angular.module('CafeApp', ['firebase']);

	cafeApp
		.config(function () {
			var firebaseObj = {
				apiKey: "AIzaSyBDsD4wl8GTHCVPL_IJ8tbiBhKVuTVCfDI",
				authDomain: "cafe-app-52993.firebaseio.com",
				databaseURL: 'https://cafe-app-52993.firebaseio.com',
				projectId: "cafe-app-52993",
				storageBucket: "",
				messagingSenderId: "257963047060",
				appId: "1:257963047060:web:a2c7416276ba0730"
			};

			firebase.initializeApp(firebaseObj);
//			const dbRootRef = firebase.database().ref();
		});
	
    cafeApp.controller('TitleController', TitleController);
	
	cafeApp
		.controller('AppHeaderController', AppHeaderController)
		.controller('AppController', AppController);

	cafeApp
        .controller('LoginScreenHeaderController', LoginScreenHeaderController)
        .controller('LoginScreenController', LoginScreenController);
	
    cafeApp
        .controller('SignUpScreenHeaderController', SignUpScreenHeaderController)
        .controller('SignUpScreenController', SignUpScreenController);

    cafeApp
        .controller('HomeScreenHeaderController', HomeScreenHeaderController)
        .controller('HomeScreenController', HomeScreenController);
	
	cafeApp
		.controller('PlaceOrderHeaderController', PlaceOrderHeaderController)
		.controller('PlaceOrderController', PlaceOrderController);
	
    cafeApp.controller('FooterController', FooterController);
	
    cafeApp
		.factory('PageTitleService', PageTitleService)
		.factory('LoginService', LoginService)
		.factory('OrderService', OrderService);
	
	cafeApp.constant('URL', 'https://cafe-app-52993.firebaseio.com');
	
//	cafeApp
//		.config(['$routeProvider', function ($routeProvider) {
//			$routeProvider
//				.when('/home', {
//					templateUrl: './home/home.html',
//					controller: 'HomeScreenController'
//				})
//				.when('/login', {
//					templateUrl: './login/login.html',
//					controller: 'LoginScreenController'
//				})
//				.otherwise({
//					redirectTo: '../index.html'
//				});
//		}]);
	
	var email = '', mobileNumber = '', name = '', password = '', conPassword;
	
	var isFooterVisible = false;

    TitleController.$inject = ['PageTitleService'];
    function TitleController(PageTitleService) {
        var title = this;

        title.pageTitle = PageTitleService.getTitle;
    }
	
	AppHeaderController.$inject = ['$scope', 'PageTitleService', 'LoginService'];
    function AppHeaderController($scope, PageTitleService, LoginService) {
        var header = this,
			pageTitle = "Cafe App",
			login = 'Login',
			signUp = 'Sign Up';

        header.title = PageTitleService.getTitle(pageTitle);
		header.user = LoginService.getUser();

		if (header.user.uid !== undefined && mobileNumber.length !== '') {
			window.location = './home/home.html';
		}
		
        header.login = function () {
        };
		
		header.signUp = function () {
		};
		
		header.logout = LoginService.logoutUser;
    }
	
	AppController.$inject = ['$firebaseAuth', 'URL', 'LoginService'];
	function AppController($firebaseAuth, URL, LoginService) {
		var app = this;
		
		app.user = LoginService.getUser();
		if (app.user.uid !== undefined && app.user.uid !== null && app.user.uid !== '') {
			console.log(app.user);
		} else {
			// Redirect to Login
			window.location = './login/login.html';
		}
	}

    LoginScreenHeaderController.$inject = ['$scope', 'PageTitleService'];
    function LoginScreenHeaderController($scope, PageTitleService) {
        var header = this;
        var pageTitle = "Login";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
    }

	LoginScreenController.$inject = ['$rootScope', '$firebaseAuth', 'URL', 'LoginService'];
    function LoginScreenController($rootScope, $firebaseAuth, URL, LoginService) {
        var loginScreen = this;

		loginScreen.login = function () {
			
//			Auth Logic will be here			
			firebase
				.auth()
				.signInWithEmailAndPassword(loginScreen.email, loginScreen.password)
				.then(function (firebaseUser) {

					loginScreen.user = {
						email: $firebaseAuth().$getAuth().email,
						name: $firebaseAuth().$getAuth().displayName,
						phone: $firebaseAuth().$getAuth().phoneNumber,
						uid: $firebaseAuth().$getAuth().uid
					};

					loginScreen.email = $firebaseAuth().$getAuth().email;
					loginScreen.name = $firebaseAuth().$getAuth().displayName;
					loginScreen.phone = $firebaseAuth().$getAuth().phoneNumber;
					loginScreen.uid = $firebaseAuth().$getAuth().uid;

					LoginService.setUser(loginScreen.email,
										 loginScreen.name,
										 loginScreen.phone,
										 loginScreen.uid);
//					console.log(LoginService.getUser());

					window.location = '../home/home.html';
//					window.location = '../index.html';
				})
				.catch(
					function (error) {
						// Handle Errors here.
						var errorCode = error.code;
						var errorMessage = error.message;
						
						// [START_EXCLUDE]
						if (errorCode === 'auth/wrong-password') {
							alert('Wrong password.');
						} else {
							alert(errorMessage);
						}
						console.log(error);
					}
				);
				
		};
    }
	
	LoginService.$inject = ['$location', '$firebaseAuth'];
	function LoginService($location, $firebaseAuth) {
		var email = '', name = '', phone = '', uid = '';
		var auth = $firebaseAuth();

		return {
			getUser: function () {
				console.log('chekcing vars!!!');
				if (localStorage.getItem('uid') === null ||
						localStorage.getItem('uid') === undefined ||
						localStorage.getItem('uid') === '') {
					
					console.log('empty store!!!');
					return {};
				} else {
					email = localStorage.getItem('email');
					name = localStorage.getItem('name');
					phone = localStorage.getItem('phone');
					uid = localStorage.getItem('uid');
					console.log('store filled!!!');
					
					return {
						email: email,
						name: name,
						phone: phone,
						uid: uid
					};
				}
			},
			setUser: function (regEmail, displayName, phoneNumber, uId) {
				localStorage.setItem('email', regEmail);
				localStorage.setItem('name', displayName);
				localStorage.setItem('phone', phoneNumber);
				localStorage.setItem('uid', uId);
				email = regEmail;
				name = displayName;
				phone = phoneNumber;
				uid = uId;
			},
			logoutUser: function () {
				auth
					.$signOut()
					.then(function () {
						email = '';
						name = '';
						phone = '';
						uid = '';
						localStorage.removeItem('email');
						localStorage.removeItem('name');
						localStorage.removeItem('phone');
						localStorage.removeItem('uid');
						localStorage.clear();
						window.location = '../login/login.html';
						console.log('Logged out');
					});
			}
		};
	}

    SignUpScreenHeaderController.$inject = ['$scope', 'PageTitleService'];
    function SignUpScreenHeaderController($scope, PageTitleService) {
        var header = this;
        var pageTitle = "Sign Up";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
    }

	SignUpScreenController.$inject = ['$http'];
    function SignUpScreenController($http) {
        var signUpScreen = this;
		
		isFooterVisible = true;
        signUpScreen.isFooterVisible = isFooterVisible;

		email = signUpScreen.email;
		mobileNumber = signUpScreen.mobileNumber;
		name = signUpScreen.name;
		password = signUpScreen.password;
		conPassword = signUpScreen.conPassword;
		
		signUpScreen.signUp = function () {
			if (password === conPassword) {
				firebase.auth()
					.createUserWithEmailAndPassword(signUpScreen.email, signUpScreen.password)
					.then(function (success) {
						window.location = '../login/login.html';
					})
					.catch(function (error) {
						// Handle Errors here.
						var errorCode = error.code, errorMessage = error.message;
						// [START_EXCLUDE]
						if (errorCode === 'auth/weak-password') {
							alert('The password is too weak.');
						} else {
							alert(errorMessage);
						}
						console.log(error);
						// [END_EXCLUDE]
					});
			}
		};

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
				}
			);
		};
    }

    HomeScreenHeaderController.$inject = ['$scope', 'PageTitleService', 'LoginService'];
    function HomeScreenHeaderController($scope, PageTitleService, LoginService) {
        var header = this,
			pageTitle = "Cafe App",
			login = 'Login',
			signUp = 'Sign Up';

        header.title = PageTitleService.getTitle(pageTitle);
		header.user = LoginService.getUser();

		if (header.user.uid !== undefined && mobileNumber.length !== '') {
			
		}
		
        header.login = function () {
        };
		
		header.signUp = function () {
		};
		
		header.logout = LoginService.logoutUser;

		// if (mobileNumber !== '' && mobileNumber.length === 10) {
		// }
        // header.login = function () {
        // };
    }

	HomeScreenController.$inject = ['$firebaseAuth', 'URL', 'LoginService'];
    function HomeScreenController($firebaseAuth, URL, LoginService) {
        var homeScreen = this;
		
		homeScreen.addItems = 'Add Items';
		homeScreen.menu = 'View Menu';
		homeScreen.activeOrders = 'Active Orders';
		homeScreen.placeOrder = 'Place Order';
		
		homeScreen.user = LoginService.getUser();
		if (homeScreen.user.uid !== undefined && homeScreen.user.uid !== null && homeScreen.user.uid !== '') {
			console.log(homeScreen.user);
			isFooterVisible = false;
			
			homeScreen.ePlaceOrder = function () {
				window.location = '../place-order/place-order.html';
			};
			
			homeScreen.eActiveOrders = function () {
				window.location = '../active-order/active-order.html';
			};
		} else {
			// Redirect to Login
			window.location = '../login/login.html';
		}
    }

    PlaceOrderHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function PlaceOrderHeaderController(PageTitleService, LoginService) {
		var header = this,
			pageTitle = "Place Order";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
	}
	
	PlaceOrderController.$inject = ['$firebaseArray', 'URL', 'OrderService', 'LoginService'];
	function PlaceOrderController($firebaseArray, URL, OrderService, LoginService) {
		var placeOrder = this;
		
		isFooterVisible = true;
		
		placeOrder.customers = ['Salim', 'Karan', 'Divyesh'];
		placeOrder.customerName = placeOrder.customers[0];
		
		placeOrder.menuItems = [
			{
				id: 1,
				name: 'Tea',
				price: 25
			},
			{
				id: 2,
				name: 'Coffee',
				price: 35.54
			},
			{
				id: 3,
				name: 'Nutella Cold Coffee',
				price: 70
			}];
		placeOrder.itemName = placeOrder.menuItems[0];
		placeOrder.quantity = 0;
		placeOrder.errorQty = false;
		placeOrder.amount = 0;
		
		placeOrder.user = LoginService.getUser();
		placeOrder.uid = placeOrder.user.uid;

		placeOrder.increase = function () {
			placeOrder.quantity++;
			placeOrder.errorQty = false;
			placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
		};
		
		placeOrder.decrease = function () {
			if (placeOrder.quantity > 0) {
				placeOrder.quantity--;
				placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
			} else {
				placeOrder.errorQty = true;
				placeOrder.errorMsg = 'Item already removed!!!';
			}
		};
		
		placeOrder.ePlaceOrder = function () {
			var timeStamp = new Date().getTime();
			
			var orderRef = firebase.database().ref().child("Orders");
			var orderUidRef = orderRef.child(placeOrder.uid);

			var orderDetails = {
				date: timeStamp,
				amount: placeOrder.amount,
				item: placeOrder.itemName.name,
				price: placeOrder.itemName.price,
				qty: placeOrder.quantity
			};

			placeOrder.orderObj = $firebaseArray(orderUidRef);

			console.log(orderDetails);
			placeOrder.orderObj.$add(orderDetails)
			.then(function (success) {
				alert('Order Placed Successfully.');
				placeOrder.customerName = placeOrder.customers[0];
				placeOrder.itemName = placeOrder.menuItems[0];
				placeOrder.errorQty = false;
				placeOrder.quantity = 0;
				placeOrder.amount = 0;
			})
			.catch(function (error) {
				console.log(error);
			});
		};
	}
	
	OrderService.$inject = ['$firebaseObject'];
	function OrderService($firebaseObject) {
		var orders = this;
		
		return {
			getOrders: function (uid) {
				
			},
			placeOrder: function(uid, timeStamp, amount, item, price, qty) {
				console.log("dbRef", dbRef);
				console.log("userRef", userRef);
				console.log("order", orderDetails);
				
				userRef.child(orderDetails);

				orders.dbSync.$bindTo(orders, "Orders");
				console.log("dbsync: ", orders.dbSync);
				
				return orders.dbSync;
			}
		};
	}

    FooterController.$inject = ['$scope']
	function FooterController ($scope) {
		var footer = this;
        
        $scope.isFooterVisible = isFooterVisible;
		footer.isFooterVisible = isFooterVisible;
		console.log(footer.isFooterVisible);
	}

    function PageTitleService() {
        var pageTitle = this;
        
        pageTitle.title = 'Cafe App';

        return {
            getTitle: function (title) {
                if (title === undefined || title === '') {
//                    pageTitle.title;
                    return pageTitle.title;
                } else if (title.includes(" - ")) {
                    pageTitle.title = title.concat(pageTitle.title);
                    return pageTitle.title;
                } else {
                    pageTitle.title = title;
                    return pageTitle.title;
                }
            }
        };
    }
})();