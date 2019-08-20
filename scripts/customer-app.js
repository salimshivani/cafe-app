(function () {
    'use strict';
    
    var customerApp = angular.module('CustomerApp', ['firebase']);

	customerApp
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
		});
	
    customerApp.controller('TitleController', TitleController);
	
	customerApp
		.controller('AppHeaderController', AppHeaderController)
		.controller('AppController', AppController);

	customerApp
        .controller('LoginScreenHeaderController', LoginScreenHeaderController)
        .controller('LoginScreenController', LoginScreenController);
	
    customerApp
        .controller('SignUpScreenHeaderController', SignUpScreenHeaderController)
        .controller('SignUpScreenController', SignUpScreenController);

    customerApp
        .controller('HomeScreenHeaderController', HomeScreenHeaderController)
        .controller('HomeScreenController', HomeScreenController);
	
	customerApp
		.controller('PlaceOrderHeaderController', PlaceOrderHeaderController)
		.controller('PlaceOrderController', PlaceOrderController);
	
	customerApp
		.controller('ViewOrdersHeaderController', ViewOrdersHeaderController)
		.controller('ViewOrdersController', ViewOrdersController);
	
    customerApp.controller('FooterController', FooterController);
	
    customerApp
		.factory('PageTitleService', PageTitleService)
		.factory('SignUpService', SignUpService)
		.factory('LoginService', LoginService)
		.factory('OrderService', OrderService);
	
	customerApp.constant('URL', 'https://cafe-app-52993.firebaseio.com');
	
//	customerApp
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
				if (localStorage.getItem('uid') === null ||
						localStorage.getItem('uid') === undefined ||
						localStorage.getItem('uid') === '') {
					
					return {};
				} else {
					email = localStorage.getItem('email');
					name = localStorage.getItem('name');
					phone = localStorage.getItem('phone');
					uid = localStorage.getItem('uid');
					
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

	SignUpScreenController.$inject = ['$firebaseArray', 'SignUpService'];
    function SignUpScreenController($firebaseArray, SignUpService) {
        var signUpScreen = this;
		
		isFooterVisible = true;
        signUpScreen.isFooterVisible = isFooterVisible;

		signUpScreen.email = '';
		signUpScreen.mobile = '';
		signUpScreen.name = '';
		signUpScreen.password = '';
		signUpScreen.conPassword = '';
		
		signUpScreen.signUp = function () {
			if (signUpScreen.password === signUpScreen.conPassword) {
				return SignUpService.registerUser(signUpScreen.email,
												  signUpScreen.mobile,
												  signUpScreen.name,
												  signUpScreen.password);
			} else {
				alert('Password mismatch');
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
	
	SignUpService.$inject = ['$firebaseArray']
	function SignUpService($firebaseArray) {
		var signUp = this;
		
		return {
			registerUser: function (email, mobile, name, password) {
				firebase.auth()
					.createUserWithEmailAndPassword(email, password)
					.then(function (success) {
						var uid = success.user.uid;
						var userRef = firebase.database().ref().child("Users");
						var userUidRef = userRef.child(uid);

						var userDetails = {
							email: email,
							mobile: mobile,
							name: name,
							role: 'user'
						};
						signUp.userObj = $firebaseArray(userUidRef);
						signUp.userObj
							.$add(userDetails)
							.then(function (success) {
								alert('Sign Up Successful');
								window.location = '../login/login.html';
							})
							.catch(function (error) {
								console.log(error);
							})
					})
//					.then(function (success) {
//						window.location = '../login/login.html';
//					})
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
		homeScreen.viewOrders = 'View Orders';
		homeScreen.placeOrder = 'Place Order';
		
		homeScreen.user = LoginService.getUser();
		if (homeScreen.user.uid !== undefined && homeScreen.user.uid !== null && homeScreen.user.uid !== '') {
			isFooterVisible = false;
			
			homeScreen.ePlaceOrder = function () {
				window.location = '../place-order/place-order.html';
			};
			
			homeScreen.eViewOrders = function () {
				window.location = '../view-order/view-order.html';
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
		
		placeOrder.amount = 0;
		placeOrder.errorMsg = '';
		placeOrder.instructions = '';
		placeOrder.quantity = 0;
		
		placeOrder.user = LoginService.getUser();
		placeOrder.uid = placeOrder.user.uid;

		placeOrder.increase = function () {
			placeOrder.required = '';
			placeOrder.quantity++;
			placeOrder.errorMsg = '';
			placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
		};
		
		placeOrder.decrease = function () {
			if (placeOrder.quantity > 0) {
				placeOrder.quantity--;
				placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
			} else {
				placeOrder.errorMsg = 'Item already removed!!!';
			}
		};
		
		placeOrder.ePlaceOrder = function () {
			var timeStamp = new Date().getTime();
			
			if (placeOrder.quantity === 0) {
				placeOrder.required = 'Required';
			} else {
				placeOrder.required = '';
				
				var orderDetails = {
					amount: placeOrder.amount,
					date: timeStamp,
					item: placeOrder.itemName.name,
					instructions: placeOrder.instructions,
					price: placeOrder.itemName.price,
					qty: placeOrder.quantity,
					status: 'Pending'
				};

				OrderService
					.placeOrder(placeOrder.uid)
					.$add(orderDetails)
					.then(function (success) {
						alert('Order Placed Successfully.');
						placeOrder.amount = 0;
						placeOrder.errorQty = false;
						placeOrder.itemName = placeOrder.menuItems[0];
						placeOrder.quantity = 0;
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		};
	}
	
	ViewOrdersHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function ViewOrdersHeaderController(PageTitleService, LoginService) {
		var header = this,
			pageTitle = "View Orders";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
	}
	
	ViewOrdersController.$inject = ['$firebaseArray', 'OrderService', 'LoginService'];
	function ViewOrdersController($firebaseArray, OrderService, LoginService) {
		var viewOrders = this;
		var orderRef = firebase.database().ref().child("Orders");
		var orderUidRef = orderRef.child(LoginService.getUser().uid);

		viewOrders.amt = 0;
		viewOrders.date = '';
		viewOrders.itemName = '';
		viewOrders.qty = 0;
		viewOrders.totalAmount = 0;

		viewOrders.ordersArray = OrderService.activeOrders(orderUidRef);
		viewOrders.orders = [];

//		console.log(viewOrders.orders);

		orderUidRef.on('child_added', function (snapshot) {
			viewOrders.orderKey = snapshot.key;

			viewOrders.amt = snapshot.val().amount;
			viewOrders.date = snapshot.val().date;
			viewOrders.itemName = snapshot.val().item;
			viewOrders.qty = snapshot.val().qty;

			var order = {
				orderKey: viewOrders.orderKey,
				amt: viewOrders.amt,
				date: viewOrders.date,
				itemName: viewOrders.itemName,
				qty: viewOrders.qty
			};

			viewOrders.totalAmount += order.amt;
			viewOrders.orders.push(order);
		});

		orderUidRef.on('child_changed', function (snapshot) {
			viewOrders.orderKey = snapshot.key;
//			console.log(snapshot.key);

			viewOrders.amt = snapshot.val().amount;
			viewOrders.date = snapshot.val().date;
			viewOrders.itemName = snapshot.val().item;
			viewOrders.qty = snapshot.val().qty;
			console.log(snapshot.val());

			var order = {
				orderKey: viewOrders.orderKey,
				amt: viewOrders.amt,
				date: viewOrders.date,
				itemName: viewOrders.itemName,
				qty: viewOrders.qty
			};

			var index = viewOrders.orders.findIndex(x => x.orderKey === viewOrders.orderKey);
			viewOrders.totalAmount -= viewOrders.orders[index].amt;
			viewOrders.orders[index] = order;

			viewOrders.ordersArray
				.$save(index)
				.then(function (success) {
					console.log("success result: ", success);
					viewOrders.totalAmount += viewOrders.amt;
				}).catch(function (error) {
					console.log(error);
				});
		});

		orderUidRef.on('child_removed', function (snapshot) {
//			console.log(JSON.stringify(snapshot.val(), null, 3));
			console.log(snapshot);

			viewOrders.orderKey = snapshot.key;

			viewOrders.amt = snapshot.val().amount;
			viewOrders.date = snapshot.val().date;
			viewOrders.itemName = snapshot.val().item;
			viewOrders.qty = snapshot.val().qty;

			var order = {
				orderKey: viewOrders.orderKey,
				amt: viewOrders.amt,
				date: viewOrders.date,
				itemName: viewOrders.itemName,
				qty: viewOrders.qty
			};
			
			var index = viewOrders.orders.findIndex(x => x.orderKey === viewOrders.orderKey);
			viewOrders.orders[index] = order;

			viewOrders.ordersArray
				.$remove(index)
				.then(function (success) {
					console.log("success result: ", success);
					viewOrders.totalAmount -= viewOrders.amt;
				}).catch(function (error) {
					console.log(error);
				});

			viewOrders.orders.splice(index, 1);
		});
		
		viewOrders.isFooterVisible = true;
	}

	OrderService.$inject = ['$firebaseArray'];
	function OrderService($firebaseArray) {
		var orders = this;
		
		orders.amt = 0;
		orders.date = '';
		orders.itemName = '';
		orders.qty = 0;
//		orders.totalAmount = 0;
		orders.list = [];

		return {
			activeOrders: function(orderUidRef) {
				return $firebaseArray(orderUidRef);
			},
			//, amount, item, instructions, price, qty
			placeOrder: function(uid) {
				var orderRef = firebase.database().ref().child("Orders");
				var orderUidRef = orderRef.child(uid);

				return $firebaseArray(orderUidRef);
			}
		};
	}

    FooterController.$inject = ['$scope']
	function FooterController ($scope) {
		var footer = this;
        
        $scope.isFooterVisible = isFooterVisible;
		footer.isFooterVisible = isFooterVisible;
	}

    function PageTitleService() {
        var pageTitle = this;
        
        pageTitle.title = 'Cafe App';

        return {
            getTitle: function (title) {
                if (title === undefined || title === '') {
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