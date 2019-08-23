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
		.controller('AddItemHeaderController', AddItemHeaderController)
		.controller('AddItemController', AddItemController);
	
	cafeApp
		.controller('ViewItemsHeaderController', ViewItemsHeaderController)
		.controller('ViewItemsController', ViewItemsController);
	
	cafeApp
		.controller('PlaceOrderHeaderController', PlaceOrderHeaderController)
		.controller('PlaceOrderController', PlaceOrderController);
	
	cafeApp
		.controller('ActiveOrdersHeaderController', ActiveOrdersHeaderController)
		.controller('ActiveOrdersController', ActiveOrdersController);
	
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
	
	var email = '', mobileNumber = '', name = '', password = '', conPassword;
	
	var isFooterVisible = false;

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
	
	AppController.$inject = ['$firebaseAuth', 'URL', 'LoginService'];
	function AppController($firebaseAuth, URL, LoginService) {
		var app = this;
		
		app.user = LoginService.getUser();
		if (app.user !== null) {
			if (app.user.uid !== null && app.user.uid !== undefined && app.user.uid !== '') {
				console.log(app.user);
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

	LoginScreenController.$inject = ['$rootScope', 'URL', 'UsersService', 'LoginService'];
    function LoginScreenController($rootScope, URL, UsersService, LoginService) {
        var loginScreen = this;

		if (LoginService.getUser() !== null) {
			if (LoginService.getUser().role === 'admin') {
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
							role: 'admin'
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

//		if (header.user === null) {
//		}
		
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

	HomeScreenController.$inject = ['$firebaseAuth', 'ItemService', 'LoginService'];
    function HomeScreenController($firebaseAuth, ItemService, LoginService) {
        var homeScreen = this;

		homeScreen.addItems = 'Add Items';
		homeScreen.menu = 'View Menu';
		homeScreen.activeOrders = 'Active Orders';
		homeScreen.placeOrder = 'Place Order';
		
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

				homeScreen.eActiveOrders = function () {
					window.location = '../active-order/active-order.html';
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

			itemRef
				.child(item.itemKey)
				.update(updatedItemValues)
				.then(function (success) {
					alert("Item updated successfully...");
				}).catch(function (error) {
					console.log(error);
				});
		};

		itemRef.on('child_added', function (snapshot) {
//			viewItems.itemKey = snapshot.key;
			console.log('2');

			viewItems.availability = snapshot.val().availability;
			viewItems.itemName = snapshot.val().itemName;
			viewItems.price = snapshot.val().price;

			var item = {
				itemKey: snapshot.key,
				availability: viewItems.availability,
				itemName: viewItems.itemName,
				price: viewItems.price
			};

			viewItems.items.push(item);
		});

		itemRef.on('child_changed', function (snapshot) {
//			viewItems.itemKey = snapshot.key;
			console.log('3');

			viewItems.availability = snapshot.val().availability;
			viewItems.itemName = snapshot.val().itemName;
			viewItems.price = snapshot.val().price;

			var item = {
				itemKey: snapshot.key,
				availability: viewItems.availability,
				itemName: viewItems.itemName,
				price: viewItems.price
			};

			index = viewItems.items.findIndex(x => x.itemKey === snapshot.key);
			viewItems.items[index] = item;
		});

		itemRef.on('child_removed', function (snapshot) {
//			viewItems.itemKey = snapshot.key;

			viewItems.availability = snapshot.val().availability;
			viewItems.itemName = snapshot.val().itemName;
			viewItems.price = snapshot.val().price;

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
	}
	
	PlaceOrderController.$inject = ['$firebaseArray', 'URL', 'OrderService'];
	function PlaceOrderController($firebaseArray, URL, OrderService) {
		var placeOrder = this;

		var usersRef = firebase.database().ref().child("Users"),//.orderByChild("name"), 
			itemRef = firebase.database().ref().child("Items").orderByChild("availability").equalTo(true);

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
					if (data[0].role === 'customer') {
						data[0].uid = snapshot.key;
						placeOrder.customers.push(data[0]);
						placeOrder.customerName = placeOrder.customers[0];
					}
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

					var index = placeOrder.customers.findIndex(x => x.$id === data[0].$id);

					if (data[0].role !== 'admin') {

						if (index === -1) {
							data[0].uid = snapshot.key;
							placeOrder.customers.push(data[0]);
							placeOrder.customerName = placeOrder.customers[0];							
						} else if (index > 0) {
							placeOrder.customers[index] = data[0];
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
					customer: placeOrder.customerName.uid,
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
	
    ActiveOrdersHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function ActiveOrdersHeaderController(PageTitleService, LoginService) {
		var header = this,
			pageTitle = "Active Orders";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
	}
	
	ActiveOrdersController.$inject = ['OrderService'];
	function ActiveOrdersController(OrderService) {
		var activeOrders = this;
		var usersOrderRef = firebase.database().ref()
									.child("Orders")
									.orderByChild("status")
									.equalTo("Pending");

		activeOrders.ordersArray = OrderService.users(usersOrderRef);
		/*activeOrders.orders = [];
		activeOrders.ordersArray.$loaded()
			.then(function (data) {
				activeOrders.orders = data;
			console.log(data);
		});*/

		/*usersOrderRef.on('child_added', function (snapshot) {
//				console.log("order child added", snapshot);

			var order = {
				orderKey: snapshot.key,
				amount: snapshot.val().amount,
				customer: snapshot.val().customer,
				date: snapshot.val().date,
				item: snapshot.val().item,
				qty: snapshot.val().qty
			};

			activeOrders.totalAmount += order.amt;
			activeOrders.orders.push(order);
		});*/

		/*usersOrderRef.on('child_changed', function (snapshot) {
			activeOrders.user = snapshot.key;
//			console.log(snapshot);

			var orderRef = usersOrderRef.child(activeOrders.user);
			var index = -1;

			orderRef.on('child_changed', function (snapshot) {
				activeOrders.orderKey = snapshot.key;
//				console.log(snapshot);

				activeOrders.amt = snapshot.val().amount;
				activeOrders.date = snapshot.val().date;
				activeOrders.itemName = snapshot.val().item;
				activeOrders.qty = snapshot.val().qty;
//				console.log(snapshot.val());

				var order = {
					user: activeOrders.user,
					orderKey: activeOrders.orderKey,
					amt: activeOrders.amt,
					date: activeOrders.date,
					itemName: activeOrders.itemName,
					qty: activeOrders.qty
				};

				index = activeOrders.orders.findIndex(x => x.orderKey === activeOrders.orderKey);
				console.log(activeOrders.orders);
//				console.log(index);
				activeOrders.orders[index] = order;
			});
			
			orderRef.on('child_removed', function (snapshot) {
				activeOrders.orderKey = snapshot.key;
//				console.log(JSON.stringify(snapshot.val(), null, 3));
//				console.log(snapshot);

				activeOrders.amt = snapshot.val().amount;
				activeOrders.date = snapshot.val().date;
				activeOrders.itemName = snapshot.val().item;
				activeOrders.qty = snapshot.val().qty;

				var order = {
					orderKey: activeOrders.orderKey,
					amt: activeOrders.amt,
					date: activeOrders.date,
					itemName: activeOrders.itemName,
					qty: activeOrders.qty
				};

				index = activeOrders.orders.findIndex(x => x.orderKey === activeOrders.orderKey);
//				console.log(activeOrders.orders);
//				console.log(index);
				activeOrders.orders.splice(index, 1);
			});
		});*/

		activeOrders.isFooterVisible = false;
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