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
		.factory('UsersService', UsersService)
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

	LoginScreenController.$inject = ['$rootScope', '$firebaseAuth', 'URL', 'UsersService', 'LoginService'];
    function LoginScreenController($rootScope, $firebaseAuth, URL, UsersService, LoginService) {
        var loginScreen = this;

		if (LoginService.getUser() !== null) {
			if (LoginService.getUser().role === 'customer') {
				window.location = '../home/home.html';
			}
		}
		
		loginScreen.login = function () {
			
//			Auth Logic will be here			
			firebase
				.auth()
				.signInWithEmailAndPassword(loginScreen.email, loginScreen.password)
				.then(function (firebaseUser) {
					loginScreen.uid = firebaseUser.user.uid;

					var userDetails = UsersService.getUserDetails(loginScreen.uid);

					userDetails.$ref().on('child_added', function (snapshot) {
						if (snapshot.val().role === 'customer') {
							loginScreen.email = snapshot.val().email;
							loginScreen.name = snapshot.val().name;
							loginScreen.phone = snapshot.val().mobile;
							loginScreen.role = snapshot.val().role;

							LoginService.setUser(loginScreen.email,
												 loginScreen.name,
												 loginScreen.phone,
												 loginScreen.role,
												 loginScreen.uid);

							window.location = '../home/home.html';
						} else {
							alert('Incorrect username or password.');
						}
					});
				})
				.catch(function (error) {
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
				});
		};
    }

	LoginService.$inject = ['$location', '$firebaseAuth'];
	function LoginService($location, $firebaseAuth) {
		var email = '', name = '', phone = '', userType = '', uid = '';
		var auth = $firebaseAuth();

		return {
			getUser: function () {
				if (localStorage.getItem('uid') === null ||
						localStorage.getItem('uid') === undefined ||
						localStorage.getItem('uid') === '') {
					
					return null;
				} else {
					email = localStorage.getItem('email');
					name = localStorage.getItem('name');
					phone = localStorage.getItem('phone');
					userType = localStorage.getItem('role');
					uid = localStorage.getItem('uid');
					
					return {
						email: email,
						name: name,
						phone: phone,
						role: userType,
						uid: uid
					};
				}
			},
			setUser: function (regEmail, displayName, phoneNumber, role, uId) {
				localStorage.setItem('email', regEmail);
				localStorage.setItem('name', displayName);
				localStorage.setItem('phone', phoneNumber);
				localStorage.setItem('role', role);
				localStorage.setItem('uid', uId);
				email = regEmail;
				name = displayName;
				phone = phoneNumber;
				userType = role;
				uid = uId;
			},
			logoutUser: function () {
				auth
					.$signOut()
					.then(function () {
						email = '';
						name = '';
						phone = '';
						userType = '';
						uid = '';
						localStorage.removeItem('email');
						localStorage.removeItem('name');
						localStorage.removeItem('phone');
						localStorage.removeItem('role');
						localStorage.removeItem('uid');
						localStorage.clear();
						window.location = '../login/login.html';
						console.log('Logged out');
					});
			}
		};
	}
	
	UsersService.$inject = ['$firebaseArray'];
	function UsersService($firebaseArray) {
		var user = this;
		
		return {
			getUserDetails: function (uid) {
				var usersRef = firebase.database().ref().child("Users"),
					userUIdRef = usersRef.child(uid);

				return $firebaseArray(userUIdRef);
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

		if (header.user !== null) {
			
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
		if (homeScreen.user !== null) {
			if (homeScreen.user.uid !== null 
				&& homeScreen.user.uid !== undefined 
				&& homeScreen.user.uid !== ''
				&& homeScreen.user.role !== null
				&& homeScreen.user.role !== undefined
				&& homeScreen.user.role === 'customer') {

				homeScreen.eViewMenu = function () {
					window.location = '../view-items/view-items.html';
				};

				homeScreen.ePlaceOrder = function () {
					window.location = '../place-order/place-order.html';
				};

				homeScreen.eViewOrders = function () {
					window.location = '../view-order/view-order.html';
				};

				homeScreen.isFooterVisible = false;
			} else {
				window.location = '../login/login.html';
			}
		} else {
			// Redirect to Login
			window.location = '../login/login.html';
		}
    }

    PlaceOrderHeaderController.$inject = ['PageTitleService'];
	function PlaceOrderHeaderController(PageTitleService) {
		var header = this,
			pageTitle = "Place Order";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
	}
	
	PlaceOrderController.$inject = ['$firebaseArray', 'URL', 'OrderService', 'LoginService'];
	function PlaceOrderController($firebaseArray, URL, OrderService, LoginService) {
		var placeOrder = this;

		var itemRef = firebase.database().ref().child("Items").orderByChild("availability").equalTo(true);
		itemRef.on('child_changed', function (snapshot) {
			var index = placeOrder.menuItems.findIndex(x => x.key === snapshot.key);
			if (snapshot.val().availability) {
				var item = {
					key: snapshot.key,
					availability: snapshot.val().availability,
					itemName: snapshot.val().itemName,
					price: snapshot.val().price
				};

				placeOrder.menuItems.push(item);
			} else {
				placeOrder.menuItems.splice(index, 1);
			}
			placeOrder.itemName = placeOrder.menuItems[0];
			console.log(placeOrder.itemName);

			placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
		});

		placeOrder.menuItems = $firebaseArray(itemRef);
		placeOrder.menuItems
			.$loaded()
			.then(function (success) {
//				console.log(success);
				placeOrder.itemName = success[0];
				placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
				placeOrder.btnDisabled = false;
			}).catch(function (error) {
				console.log(error);
			});

		placeOrder.errorMsg = '';
		placeOrder.instructions = '';
		placeOrder.quantity = 1;
		placeOrder.required = '';
		placeOrder.amount = 0;

		placeOrder.btnDisabled = true;
		
		placeOrder.user = LoginService.getUser();
		
		placeOrder.updateAmount = function () {
			placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
		};

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
		
		var orderRef = firebase.database().ref().child("Orders");
		placeOrder.ePlaceOrder = function () {
			var timeStamp = new Date().getTime();
			
			if (placeOrder.quantity === 0) {
				placeOrder.required = 'Required';
			} else {
				placeOrder.required = '';
				
				var orderDetails = {
					amount: placeOrder.amount,
					customer: placeOrder.user.uid,
					date: timeStamp,
					instructions: placeOrder.instructions,
					item: placeOrder.itemName.itemName,
					price: placeOrder.itemName.price,
					qty: placeOrder.quantity,
					status: 'Pending'
				};
//				console.log(orderDetails);

				OrderService
					.placeOrder(orderRef)
					.$add(orderDetails)
					.then(function (success) {
						alert('Order Placed Successfully.');
						placeOrder.errorQty = false;
						placeOrder.instructions = '';
						placeOrder.itemName = placeOrder.menuItems[0];
						placeOrder.quantity = 1;
						placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		};

		placeOrder.isFooterVisible = true;
	}
	
	ViewOrdersHeaderController.$inject = ['PageTitleService'];
	function ViewOrdersHeaderController(PageTitleService) {
		var header = this,
			pageTitle = "View Orders";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
	}
	
	ViewOrdersController.$inject = ['LoginService', 'OrderService'];
	function ViewOrdersController(LoginService, OrderService) {
		var viewOrders = this;
		viewOrders.user = LoginService.getUser();
		
		var usersOrderRef = firebase.database().ref()
									.child("Orders")
									.orderByChild("customer")
									.equalTo(viewOrders.user.uid);

		viewOrders.amt = 0;
		viewOrders.date = '';
		viewOrders.itemName = '';
		viewOrders.qty = 0;
		viewOrders.totalAmount = 0;

		viewOrders.ordersArray = OrderService.users(usersOrderRef);
		viewOrders.ordersArray.$loaded()
			.then(function (success) {
				angular.forEach(viewOrders.ordersArray, function(value, key) {
					viewOrders.totalAmount += value.amount;
				});
			}).catch(function (error) {
				console.log(error);
			});
		

		/*viewOrders.ordersArray = OrderService.activeOrders(orderUidRef);
		viewOrders.orders = [];*/

		/*orderUidRef.on('child_added', function (snapshot) {
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
		});*/

		/*orderUidRef.on('child_changed', function (snapshot) {
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
		});*/
		
		viewOrders.isFooterVisible = true;
	}

	OrderService.$inject = ['$firebaseArray'];
	function OrderService($firebaseArray) {
		var orders = this;

		return {
			users: function (userOrderRef) {
				return $firebaseArray(userOrderRef);
			},
			activeOrders: function(orderUidRef) {
				return $firebaseArray(orderUidRef);
			},
			placeOrder: function(orderRef) {
				return $firebaseArray(orderRef);
			}
		};
	}

	function FooterController() {
		var footer = this;
        
//        $scope.isFooterVisible = isFooterVisible;
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