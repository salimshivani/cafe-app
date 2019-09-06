(function () {
	'use strict';
    
	var cafeApp = angular.module('CafeApp', ['firebase', 'cp.ngConfirm']);

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
		.controller('AddItemHeaderController', AddItemHeaderController)
		.controller('AddItemController', AddItemController);
	
	cafeApp
		.controller('ViewItemsHeaderController', ViewItemsHeaderController)
		.controller('ViewItemsController', ViewItemsController);
	
	cafeApp
		.controller('PlaceOrderHeaderController', PlaceOrderHeaderController)
		.controller('PlaceOrderController', PlaceOrderController);
	
	cafeApp
		.controller('OrdersHeaderController', OrdersHeaderController)
		.controller('OrdersController', OrdersController);

	cafeApp
		.controller('CoWorkersHeaderController', CoWorkersHeaderController)
		.controller('CoWorkersController', CoWorkersController);
	
	cafeApp.controller('FooterController', FooterController);
	
	cafeApp
		.factory('PageTitleService', PageTitleService)
		.factory('SignUpService', SignUpService)
		.factory('LoginService', LoginService)
		.factory('UsersService', UsersService)
		.factory('ItemService', ItemService)
		.factory('OrderService', OrderService);

	cafeApp.constant('URL', 'https://cafe-app-52993.firebaseio.com');
	
/*	cafeApp
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider
				.when('/home', {
					templateUrl: './home/home.html',
					controller: 'HomeScreenController'
				})
				.when('/login', {
					templateUrl: './login/login.html',
					controller: 'LoginScreenController'
				})
				.otherwise({
					redirectTo: '../index.html'
				});
		}]);*/
	
	var email = '', mobileNumber = '', name = '', password = '', conPassword, isFooterVisible = false;

	TitleController.$inject = ['PageTitleService'];
	function TitleController(PageTitleService) {
        var title = this;

        title.pageTitle = PageTitleService.getTitle;
    }
	
	AppHeaderController.$inject = ['PageTitleService'];
	function AppHeaderController(PageTitleService) {
		var header = this,
				pageTitle = "Cafe App",
				login = 'Login',
				signUp = 'Sign Up';
		
		header.title = PageTitleService.getTitle(pageTitle);
	}
	
	AppController.$inject = ['$firebaseAuth', 'LoginService'];
	function AppController($firebaseAuth, LoginService) {
		var app = this;
		
		app.user = LoginService.getUser();
		if (app.user !== null) {
			if (app.user.uid !== null 
					&& app.user.uid !== undefined 
					&& app.user.uid !== '' 
					&& app.user.role === 'admin') {
				console.log(app.user);
				window.location = '../cafe/home/home.html';
			} else {
				// Redirect to Login
				window.location = '../cafe/login/login.html';
			}
		} else {
			// Redirect to Login
			window.location = '../cafe/login/login.html';
		}
	}

	LoginScreenHeaderController.$inject = ['$scope', 'PageTitleService'];
	function LoginScreenHeaderController($scope, PageTitleService) {
        var header = this;
        var pageTitle = "Cafe Login";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
    }

	LoginScreenController.$inject = ['$rootScope', 'UsersService', 'LoginService', '$ngConfirm'];
	function LoginScreenController($rootScope, UsersService, LoginService, $ngConfirm) {
        var loginScreen = this;

		if (LoginService.getUser() !== null) {
			if (LoginService.getUser().role === 'admin') {
				window.location = '../home/home.html';
			}
		}

		loginScreen.login = function () {
			
//			Auth Logic will be here			
			firebase.auth().signInWithEmailAndPassword(loginScreen.email, loginScreen.password)
				.then(function (firebaseUser) {
					loginScreen.uid = firebaseUser.user.uid;

					var userDetails = UsersService.getUserDetails(loginScreen.uid);

					userDetails.$ref().on('child_added', function (snapshot) {
						if (snapshot.val().role === 'admin') {
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
				}).catch(function (error) {
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
				firebase.auth().createUserWithEmailAndPassword(email, password).then(
					function (success) {
						var uid = success.user.uid;
						var userRef = firebase.database().ref().child("Users");
						var userUidRef = userRef.child(uid);

						var userDetails = {
							email: email,
							mobile: mobile,
							name: name,
							role: 'admin'
						};
						signUp.userObj = $firebaseArray(userUidRef);
						signUp.userObj.$add(userDetails).then(function (success) {
							alert('Sign Up Successful');
							window.location = '../login/login.html';
						}).catch(function (error) {
							console.log(error);
						});
				}).catch(function (error) {
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
		if (header.user === null) {
			window.location = '../login/login.html';
		}
		
		header.logout = LoginService.logoutUser;
    }

	HomeScreenController.$inject = ['$firebaseAuth', 'ItemService', 'LoginService', '$ngConfirm'];
	function HomeScreenController($firebaseAuth, ItemService, LoginService, $ngConfirm) {
        var homeScreen = this;

		homeScreen.addItems = 'Add Items';
		homeScreen.menu = 'View Menu';
		homeScreen.orders = 'Orders';
		homeScreen.placeOrder = 'Place Order';
		homeScreen.coWorkers = 'Co-Workers';
		
		homeScreen.user = LoginService.getUser();
		if (homeScreen.user !== null) {
			if (homeScreen.user.uid !== null 
				&& homeScreen.user.uid !== undefined 
				&& homeScreen.user.uid !== ''
				&& homeScreen.user.role !== null
				&& homeScreen.user.role !== undefined
				&& homeScreen.user.role === 'admin') {

				homeScreen.eAddItem = function () {
					window.location = '../add-item/add-item.html';
				};

				homeScreen.eViewItems = function () {
					window.location = '../view-items/view-items.html';
				};

				homeScreen.ePlaceOrder = function () {
					window.location = '../place-order/place-order.html';
				};

				homeScreen.eOrders = function () {
					window.location = '../orders/orders.html';
				};

				homeScreen.eCoWorkers = function () {
					window.location = '../co-workers/co-workers.html';
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

	AddItemHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function AddItemHeaderController(PageTitleService, LoginService) {
		var header = this,
			pageTitle = "Add Items";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../login/login.html';
		}
		if (header.user.role === 'customer') {
			header.logoutUser();
		}

		header.logout = LoginService.logoutUser;
	}
	
	AddItemController.$inject = ['$firebaseArray', 'ItemService', 'LoginService'];
	function AddItemController($firebaseArray, ItemService, LoginService) {
		var addItem = this,
			itemRef = firebase.database().ref().child("Items");

		addItem.itemName = '';
		addItem.price = 0;
		addItem.availability = true;
		
		addItem.errorMsg = 'Required';
		
		addItem.user = LoginService.getUser();

		addItem.eAddItem = function () {
			var item = {
				availability: addItem.availability,
				itemName: addItem.itemName,
				price: addItem.price
			};

			ItemService
				.addItem(itemRef)
				.$add(item)
				.then(function (success) {
					alert('Item Saved Successfully.');
					addItem.availability = false;
					addItem.itemName = '';
					addItem.price = 0;
				})
				.catch(function (error) {
					console.log(error);
				});
		};
		
		addItem.isFooterVisible = true;
	}
	
	ViewItemsHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function ViewItemsHeaderController(PageTitleService, LoginService) {
		var header = this,
			pageTitle = "View Items";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../login/login.html';
		}
		if (header.user.role === 'customer') {
			header.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
	}
	
	ViewItemsController.$inject = ['ItemService'];
	function ViewItemsController(ItemService) {
		var viewItems = this;
		var itemRef = firebase.database().ref().child("Items");
		var index = -1;

		/*itemRef.on('value', snap => {
			JSON.stringify(snap.val(), null, 3);
			console.log(snap);
			console.log(snap.val());
			console.log('1');
		});*/
		
		viewItems.availability = false;
		viewItems.itemName = '';
		viewItems.price = 0;

		viewItems.items = [];
		viewItems.itemsArray = ItemService.getItems(itemRef);
		
		viewItems.updateStatus = function (item) {
//			viewItems.itemKey = item.itemKey;

			var updatedItemValues = {
				availability: item.availability,
				itemName: item.itemName,
				price: item.price
			};

			index = viewItems.items.findIndex(x => x.itemKey === item.itemKey);
//			viewItems.items[index] = item;
//			viewItems.itemsArray[index] = item;

			itemRef.child(item.itemKey).update(updatedItemValues).then(function (success) {
				alert("Item updated successfully...");
			}).catch(function (error) {
				console.log(error);
			});
		};

		itemRef.on('child_added', function (snapshot) {
			var item = {
				itemKey: snapshot.key,
				availability: snapshot.val().availability,
				itemName: snapshot.val().itemName,
				price: snapshot.val().price
			};

			viewItems.items.push(item);
		});

		itemRef.on('child_changed', function (snapshot) {
			var item = {
				itemKey: snapshot.key,
				availability: snapshot.val().availability,
				itemName: snapshot.val().itemName,
				price: snapshot.val().price
			};

			index = viewItems.items.findIndex(x => x.itemKey === snapshot.key);
			viewItems.items[index] = item;
		});

		itemRef.on('child_removed', function (snapshot) {
			index = viewItems.items.findIndex(x => x.itemKey === snapshot.key);
			viewItems.items.splice(index, 1);
		});

		viewItems.isFooterVisible = false;
	}
	
	ItemService.$inject = ['$firebaseArray'];
	function ItemService($firebaseArray) {
		var orders = this;
//		var itemRef = firebase.database().ref().child("Items");
		var items = [];

		return {
			/*getAllItems: function () {
				var itemRef = firebase.database().ref().child("Items");

				itemRef.on('child_added', function (snapshot) {
					var itemId = '', itemName = '', price = 0, availability = false;

					itemId = snapshot.key;
					availability = snapshot.val().availability;
					itemName = snapshot.val().itemName;
					price = snapshot.val().price;

					var item = {
						key: itemId,
						availability: availability,
						itemName: itemName,
						price: price
					};
					items.push(item);
				});
				
				itemRef.on('child_changed', function (snapshot) {
					var itemId = '', itemName = '', price = 0, availability = false;

					itemId = snapshot.key;
					availability = snapshot.val().availability;
					itemName = snapshot.val().itemName;
					price = snapshot.val().price;

					var item = {
						key: itemId,
						availability: availability,
						itemName: itemName,
						price: price
					};
					var index = items.findIndex(x => x.key === itemId);
					console.log(index);
					items[index] = item;
				});
			},*/
			getItems: function(itemRef) {
				return $firebaseArray(itemRef);
			},
			addItem: function(itemRef) {
				return $firebaseArray(itemRef);
			}
		};
	}
	
	PlaceOrderHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function PlaceOrderHeaderController(PageTitleService, LoginService) {
		var header = this,
			pageTitle = "Place Order";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../login/login.html';
		}
		if (header.user.role === 'customer') {
			header.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
	}
	
	PlaceOrderController.$inject = ['$firebaseArray', 'URL', 'OrderService'];
	function PlaceOrderController($firebaseArray, URL, OrderService) {
		var placeOrder = this;

		var usersRef = firebase.database().ref().child("Users"),//.orderByChild("name"), 
			itemRef = firebase.database().ref().child("Items")
												.orderByChild("availability")
												.equalTo(true);

		placeOrder.customers = [];

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

		usersRef.on('child_added', function (snapshot) {
			var custRef = usersRef.child(snapshot.key).orderByChild("name");
			placeOrder.customerArray = $firebaseArray(custRef);
			placeOrder.customerArray
				.$loaded()
				.then(function (data) {
//					console.log(data.length);
					if (data.length === 1 && data[0].role === 'customer') {
						console.log('length: =', '1');
						var customerDetails = {
							email: data[0].email,
							mobile: data[0].mobile,
							name: data[0].name,
							key: data[0].$id,
							uid: snapshot.key
						};
						placeOrder.customers.push(customerDetails);
					} else if (data.length > 1 && data[1].role === 'customer') {
						console.log('length: 1 < ', data.length);
						var customerDetails = {
							email: data[1].email,
							mobile: data[1].mobile,
							name: data[1].name,
							key: data[1].$id,
							uid: snapshot.key
						};
						placeOrder.customers.push(customerDetails);
					}
					placeOrder.customerName = placeOrder.customers[0];
				});
		});

		usersRef.on('child_changed', function (snapshot) {
			var custRef = usersRef.child(snapshot.key);

			placeOrder.customerArray = $firebaseArray(custRef);
			placeOrder.customerArray.$loaded()
				.then(function (data) {
//					console.log(data);
//					console.log(data[0]);
//					console.log(data[0].$id);

					var index = placeOrder.customers.findIndex(x => x.key === data[0].$id);

					if (data[0].role === 'customer') {

						if (index === -1) {
							var customerDetails = {
								email: data[0].email,
								mobile: data[0].mobile,
								name: data[0].name,
								key: data[0].$id,
								uid: snapshot.key
							};
							placeOrder.customers.push(customerDetails);
							placeOrder.customerName = placeOrder.customers[0];							
						} else if (index > 0) {
							var customerDetails = {
								email: data[0].email,
								mobile: data[0].mobile,
								name: data[0].name,
								key: data[0].$id,
								uid: snapshot.key
							};
							placeOrder.customers[index] = customerDetails;
							placeOrder.customerName = placeOrder.customers[0];							
						}

					} else {
						if (index > -1) {
							console.log('aIndex: ', index);
							placeOrder.customers.splice(index, 1);
							placeOrder.customerName = placeOrder.customers[0];							
						}
					}
				});
		});

		/*itemRef.on('value', function (snapshot) {
			placeOrder.itemName = placeOrder.menuItems[0];
			placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
			placeOrder.btnDisabled = false;
		});*/

		/*itemRef.on('child_added', function (snapshot) {
			if (snapshot.val().availability) {
				var item = {
					key: snapshot.key,
					availability: snapshot.val().availability,
					itemName: snapshot.val().itemName,
					price: snapshot.val().price
				};
				placeOrder.menuItems.push(item);
			}

			placeOrder.itemName = placeOrder.menuItems[0];
			console.log(placeOrder.itemName);

			placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
		});*/

		firebase.database().ref().child("Items").on('child_changed', function (snapshot) {
			var index = placeOrder.menuItems.findIndex(x => x.$id === snapshot.key);
//			console.log(index);

			if (index > -1 && snapshot.val().availability) {
				placeOrder.menuItems[index].itemName = snapshot.val().itemName;
				placeOrder.menuItems[index].price = snapshot.val().price;

				placeOrder.price = placeOrder.itemName.price;
			} else if (index === -1 && snapshot.val().availability) {
				var item = {
					key: snapshot.key,
					availability: snapshot.val().availability,
					itemName: snapshot.val().itemName,
					price: snapshot.val().price
				};

//				placeOrder.menuItems.push(item);
				placeOrder.itemName = placeOrder.menuItems[0];
				placeOrder.price = placeOrder.itemName.price;
			} else {
				placeOrder.menuItems.splice(index, 0);
				placeOrder.itemName = placeOrder.menuItems[0];
				placeOrder.price = placeOrder.itemName.price;
			}

			placeOrder.amount = placeOrder.quantity * placeOrder.price;
		});
		
		placeOrder.changeCustomer = function (item) {
			placeOrder.customerName = item;
		};

		placeOrder.updateAmount = function (item) {
			placeOrder.amount = placeOrder.quantity * item.price;
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
		
		var orderRef = firebase.database().ref().child("Orders"), 
			userOrderRef = firebase.database().ref().child("Users");

		placeOrder.ePlaceOrder = function () {
			var timeStamp = new Date().getTime();

			if (placeOrder.quantity === 0) {
				placeOrder.required = 'Required';
			} else {
				placeOrder.required = '';
				
				var orderDetails = {
					amount: placeOrder.amount,
					customerUId: placeOrder.customerName.uid,
					customerKey: placeOrder.customerName.key,
					date: timeStamp,
					instructions: placeOrder.instructions,
					item: placeOrder.itemName.itemName,
					price: placeOrder.itemName.price,
					qty: placeOrder.quantity,
					isDelivered: false
				};
//				console.log(placeOrder.customerName);
//				console.log(placeOrder.customerName.uid);

				OrderService
					.placeOrder(orderRef)
					.$add(orderDetails)
					.then(function (success) {

//						console.log(success);
						orderDetails.customerUId = null;
						orderDetails.customerKey = null;
//						OrderService.placeOrder(
						userOrderRef
							.child(placeOrder.customerName.uid)
							.child(placeOrder.customerName.key)
							.child("Orders")
							.child(success.key)
							.set(orderDetails)
							.then(function (success) {
								alert('Order Placed Successfully.');
								/*placeOrder.customerName = placeOrder.customers[0];
								placeOrder.errorQty = false;
								placeOrder.instructions = '';
								placeOrder.itemName = placeOrder.menuItems[0];
								placeOrder.quantity = 1;
								placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;*/
							})
							.catch(function (error) {
								console.log(error);
							});
						placeOrder.customerName = placeOrder.customers[0];
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
	
	OrdersHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function OrdersHeaderController(PageTitleService, LoginService) {
		var header = this,
			pageTitle = "Orders";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../login/login.html';
		}
		if (header.user.role === 'customer') {
			header.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
	}
	
	OrdersController.$inject = ['$firebaseArray', 'OrderService'];
	function OrdersController($firebaseArray, OrderService) {
		var orders = this;
		var pendingOrderRef = firebase.database().ref()
									.child("Orders")
									.orderByChild("isDelivered")
									.equalTo(false);
		var customerRef = firebase.database().ref().child("Users");
		
		orders.filter = ['Pending', 'Customer', 'All Orders'];
		orders.filterByType = orders.filter[0];

		orders.customers = [];

		orders.ordersArray = OrderService.users(pendingOrderRef);
		orders.ordersArray.$loaded()
			.then(function (order) {
				orders.orders = order;
				for (var i = 0; i < order.length; i++) {
					$firebaseArray(customerRef.child(order[i].customerUId + "/" + order[i].customerKey))
						.$loaded()
						.then(function (customer) {
//							console.log(customer.$ref().parent.key);
							var customerDetails = {
								name: customer[3].$value,
								email: customer[1].$value,
								uid: customer.$ref().parent.key
							};
							if (orders.customers
								.findIndex(x => x.uid === customer.$ref().parent.key) === -1) {
								orders.customers.push(customerDetails);
							}
							orders.filterByCustomer = orders.customers[0];
						}).catch(function (error) {
							console.log(error);
						});
				}
			}).catch(function (error) {
				console.log(error);
			});

		orders.customerName = function (customerUId, customerKey) {
			let index = orders.customers.findIndex(x => x.uid === customerUId);
			return orders.customers[index].name;
		};

		orders.applyFilter = function (filter) {
			if (filter === 'Pending') {
				orders.ordersArray = OrderService.users(pendingOrderRef);
			} else if (filter === 'All Orders') {
				var ordersRef = firebase.database().ref().child("Orders").limitToLast(100);

				orders.ordersArray = OrderService.users(ordersRef);
			} else if (filter === 'Date') {
				var ordersByDateRef = firebase.database().ref().child("Orders").orderByChild("date");

				orders.ordersArray = OrderService.users(ordersByDateRef);
			} else if (filter === 'Customer') {
				var customerOrdersRef = customerRef.child(orders.filterByCustomer.uid);

				$firebaseArray(customerOrdersRef).$loaded().then(function (order) {
					var usersOrder = customerOrdersRef.child(order[0].$id).child("Orders");

					orders.ordersArray = OrderService.users(usersOrder);
					orders.ordersArray.$loaded(function (success) {
						console.log("Orders filtered");
					}).catch(function (error) {
						console.log(error);
					});
				}).catch(function (error) {
					console.log(error);
				});
			}
		};

		orders.delivered = function (order) {
			var updatedOrderValues = {
				isDelivered: true
			};

			firebase.database().ref().child("Orders")
				.child(order.$id)
				.update(updatedOrderValues)
				.then(function (successOrder) {

					customerRef
						.child(order.customerUId + "/" + order.customerKey)
						.child("Orders")
						.child(order.$id)
						.update(updatedOrderValues)
						.then(function (successUsersOrder) {
							alert("Order delivered successfully...");
						}).catch(function (error) {
							console.log(error);
						});
				}).catch(function (error) {
					console.log(error);
				});
		};

		orders.isFooterVisible = false;
	}
	
	OrderService.$inject = ['$firebaseArray'];
	function OrderService($firebaseArray) {
		var orders = this;
		
		return {
			users: function (userOrderRef) {
				return $firebaseArray(userOrderRef);
			},
			activeOrders: function(orderRef) {
				return $firebaseArray(orderRef);
			},
			placeOrder: function(orderRef) {
				return $firebaseArray(orderRef);
			}
		};
	}

	CoWorkersHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function CoWorkersHeaderController(PageTitleService, LoginService) {
		var header = this,
			pageTitle = "Co-Workers";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../login/login.html';
		}
		if (header.user.role === 'customer') {
			header.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
	}

	CoWorkersController.$inject = ['$firebaseArray', '$scope', '$ngConfirm'];
	function CoWorkersController($firebaseArray, $scope, $ngConfirm) {
		var coWorkers = this, 
				usersRef = firebase.database().ref().child("Users");

		coWorkers.isAdded = false;
		coWorkers.customers = [];

		$firebaseArray(usersRef).$loaded(function (success) {

			angular.forEach(success, function (value, key) {

				var customerRef = usersRef.child(success[key].$id);
				customerRef.on('child_added', function (snapshot) {

					if (snapshot.val().role === 'customer') {
						var coWorker = {
							key: snapshot.key,
							company: snapshot.val().company,
							email: snapshot.val().email,
							mobile: snapshot.val().mobile,
							name: snapshot.val().name
						};
						coWorkers.customers.push(coWorker);
					}

				});

			});

		});
		
		usersRef.on('child_added', function (snapshot) {
			usersRef.child(snapshot.key).on('value', function (snapshotUser) {
				console.log('added: ', snapshotUser.val());
			});
			console.log('added: ', snapshot.val());
		});

		usersRef.on('child_changed', function (snapshot) {
			console.log('updated: ', snapshot.val());
		});
		
		coWorkers.eNewCoWorker = function () {
//			swal("Hello world!");
			$ngConfirm({
				title: 'Add Co-Worker',
//				backgroundDismiss: true,
				boxWidth: '90%',
//				content: 'Here goes a little content, <strong>{{hey}}</strong>',
				contentUrl: 'add-co-worker.html', // if contentUrl is provided, 'content' is ignored
				columnClass: 'large',
				escapeKey: 'close',
				typeAnimated: true,
				name: "new-co-worker",
				scope: $scope,
				useBootstrap: false,
				buttons: {   
					ok: { 
						btnClass: 'btn-green',
						text: "Add",
						keys: ['enter', 'return'],
						action: function (scope) {
//							console.log(scope.coWorker);
							
							if (scope.coWorker.password === scope.coWorker.conPassword) {
								firebase.auth()
									.createUserWithEmailAndPassword(scope.coWorker.email, scope.coWorker.password)
									.then(function (success) {
										console.log(success);
										console.log(success.user);

										success.user.sendEmailVerification()
											.then(function () {
											//Mail sent
											var userUidRef = usersRef.child(success.user.uid);

											var coWorkerDetails = {
												company: scope.coWorker.company,
												email: scope.coWorker.email,
												mobile: scope.coWorker.mobile,
												name: scope.coWorker.name,
												role: 'customer'
											};

											coWorkers.newCoWorker = $firebaseArray(userUidRef);
											coWorkers.newCoWorker.$add(coWorkerDetails).then(function (success) {
												coWorkers.isAdded = true;
												scope.coWorker = null;

												coWorkers.newCoWorker.$loaded(function (snapshot) {
													var coWorker = {
														key: snapshot[0].$id,
														company: snapshot[0].company,
														email: snapshot[0].email,
														mobile: snapshot[0].mobile,
														name: snapshot[0].name,
														status: snapshot[0].status
													};
													coWorkers.customers.push(coWorker);

												}).catch(function (error) {
													console.log(error);
												});

												$ngConfirm({
													boxWidth: '75%',
													columnClass: 'medium',
													content: 'Sign Up Successful',
													title: 'Success',
													type: 'green',
													typeAnimated: true,
													useBootstrap: false,
													buttons: {
														ok: {
															btnClass: 'btn-green',
															text: "OK",
															action: function () {
																return true;
															}
														}
													}
												});

												return coWorkers.isAdded;
											}).catch(function (error) {
												console.log(error);
											});
										})
											.catch(function (error) {
											console.log(error);
										});

										firebase.auth().sendPasswordResetEmail(success.user.email)
											.then(function (success) {
												$ngConfirm({
													boxWidth: '75%',
													columnClass: 'medium',
													content: 'Link to set your new password has been sent to you. Please set your password to proceed further.',
													title: 'Reset Password',
													type: 'green',
													typeAnimated: true,
													useBootstrap: false,
													buttons: {
														ok: {
															btnClass: 'btn-green',
															text: "OK",
															action: function () {
																return true;
															}
														}
													}
												});
											})
											.catch(function (error) {
												console.log(error);
											});

										success.user.updateProfile({
											displayName: scope.coWorker.name,
											phoneNumber: scope.coWorker.mobile
										}).then(function () {
											window.top.close();
										}).catch(function (error) {
											$ngConfirm({
												title: 'Error',
												backgroundDismiss: true,
												boxWidth: '75%',
												content: erorr.message,
												columnClass: 'medium',

												typeAnimated: true,
												useBootstrap: false,
												buttons: {
													close: {
														btnClass: 'btn-red',
														boxWidth: '75%',
														columnClass: 'medium',
														keys: ['esc'],
														text: "Cancel"
													}
												}
											})
										});

								}).catch(function (error) {
									// Handle Errors here.
									var errorCode = error.code, errorMessage = error.message;
									// [START_EXCLUDE]
									if (errorCode === 'auth/weak-password') {
										$ngConfirm({
											boxWidth: '75%',
											columnClass: 'medium',
											title: 'Error',
											content: 'The password is too weak.',
											type: 'red',
											typeAnimated: true,
											useBootstrap: false,
											buttons: {
												ok: {
													text: 'OK',
													btnClass: 'btn-red',
													action: function (){
														return true;
													}
												}
											}
										});
									} else {
										$ngConfirm({
											boxWidth: '75%',
											columnClass: 'medium',
											content: errorMessage,
											typeAnimated: true,
											type: 'red',
											useBootstrap: false,
											buttons: {
												ok: {
													text: 'Ok',
													btnClass: 'btn-red',
													action: function () {
														return true;
													}
												}
											}
										});
									}
									console.log(error);
									// [END_EXCLUDE]
								});

							} else {
								$ngConfirm({
									buttons: {
										ok: {
											text: 'OK',
											btnClass: 'btn-red',
											action: function(){
												return true;
											}
										}
									},
									boxWidth: '75%',
									columnClass: 'medium',
									content: 'Password mismatch',
									title: 'Error',
									type: 'red',
									typeAnimated: true,
									useBootstrap: false
								});
							}
						}
					},
					close: {
						btnClass: 'btn-red',
						boxWidth: '75%',
						columnClass: 'medium',
						keys: ['esc'],
						text: "Cancel"
					}
				},
			});
		};
	}

	function FooterController () {
		var footer = this;
        
//        $scope.isFooterVisible = isFooterVisible;
		footer.isFooterVisible = isFooterVisible;
	}

    function PageTitleService () {
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