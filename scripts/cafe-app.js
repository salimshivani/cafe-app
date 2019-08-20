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
//		.factory('UsersService', UsersService)
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
			window.location = '../cafe/login/login.html';
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
				
//				console.log(firebaseUser);
//				console.log($firebaseAuth().$getAuth());

					loginScreen.email = $firebaseAuth().$getAuth().email;
					loginScreen.name = $firebaseAuth().$getAuth().displayName;
					loginScreen.phone = $firebaseAuth().$getAuth().phoneNumber;
					loginScreen.role = 'user-role';
					loginScreen.uid = $firebaseAuth().$getAuth().uid;


//					var userType = UsersService.getUserType(loginScreen.uid);
//					console.log(userType);

					LoginService.setUser(loginScreen.email,
										 loginScreen.name,
										 loginScreen.phone,
										 loginScreen.role,
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
		var email = '', name = '', phone = '', userType = '', uid = '';
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
	
	UsersService.$inject = ['$firebaseAuth', '$firebaseArray'];
	function UsersService($firebaseAuth, $firebaseArray) {
		var users = this;
		var usersRef = firebase.database().ref().child("Users");

		return {
			getUserType: function () {
				users.usersArray = $firebaseArray(usersRef);
				users.users = [];
				
				usersRef.on('child_added', function (snapshot) {
					users.UId = snapshot.key;
					var usersUIdRef = usersRef.child(users.UId);
					
					viewItems.itemName = snapshot.val().itemName;
					viewItems.price = snapshot.val().price;

					var item = {
						itemKey: snapshot.key,
						availibilty: viewItems.availibilty,
						itemName: viewItems.itemName,
						price: viewItems.price
					};

					viewItems.items.push(item);
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
			isFooterVisible = false;
			
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
		var addItem = this;
		var itemRef = firebase.database().ref().child("Items");

		addItem.itemName = '';
		addItem.price = 0;
		addItem.availibilty = true;
		
		addItem.errorMsg = 'Required';
		
		addItem.user = LoginService.getUser();

		addItem.eAddItem = function () {
			var item = {
				availibilty: addItem.availibilty,
				itemName: addItem.itemName,
				price: addItem.price
			};

			ItemService
				.addItem(itemRef)
				.$add(item)
				.then(function (success) {
					alert('Item Saved Successfully.');
					addItem.availibilty = false;
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

		itemRef.on('value', snap => {
			JSON.stringify(snap.val(), null, 3);
//			console.log(snap);
//			console.log(snap.val());
		});
		
		viewItems.availibilty = false;
		viewItems.itemName = '';
		viewItems.price = 0;

		viewItems.items = [];
		viewItems.itemsArray = ItemService.getItems(itemRef);
		
		viewItems.updateStatus = function (item) {
//			viewItems.itemKey = item.itemKey;

			var updatedItemValues = {
				availibilty: item.availibilty,
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
					console.log("Item updated successfully...");
				}).catch(function (error) {
					console.log(error);
				});
		};

		itemRef.on('child_added', function (snapshot) {
//			viewItems.itemKey = snapshot.key;

			viewItems.availibilty = snapshot.val().availibilty;
			viewItems.itemName = snapshot.val().itemName;
			viewItems.price = snapshot.val().price;

			var item = {
				itemKey: snapshot.key,
				availibilty: viewItems.availibilty,
				itemName: viewItems.itemName,
				price: viewItems.price
			};

			viewItems.items.push(item);
		});

		itemRef.on('child_changed', function (snapshot) {
//			viewItems.itemKey = snapshot.key;

			viewItems.availibilty = snapshot.val().availibilty;
			viewItems.itemName = snapshot.val().itemName;
			viewItems.price = snapshot.val().price;

			var item = {
				itemKey: snapshot.key,
				availibilty: viewItems.availibilty,
				itemName: viewItems.itemName,
				price: viewItems.price
			};

			index = viewItems.items.findIndex(x => x.itemKey === snapshot.key);
			viewItems.items[index] = item;
		});

		itemRef.on('child_removed', function (snapshot) {
//			viewItems.itemKey = snapshot.key;

			viewItems.availibilty = snapshot.val().availibilty;
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

		return {
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
						placeOrder.customerName = placeOrder.customers[0];
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
		var usersOrderRef = firebase.database().ref().child("Orders");

		activeOrders.ordersArray = OrderService.users(usersOrderRef);
		activeOrders.orders = [];

		usersOrderRef.on('child_added', function (snapshot) {
			activeOrders.user = snapshot.key;
//			console.log(snapshot);
			
			var orderRef = usersOrderRef.child(activeOrders.user);
			
			orderRef.on('child_added', function (snapshot) {
				activeOrders.orderKey = snapshot.key;
//				console.log("order child added", snapshot);

				activeOrders.amt = snapshot.val().amount;
				activeOrders.date = snapshot.val().date;
				activeOrders.itemName = snapshot.val().item;
				activeOrders.qty = snapshot.val().qty;

				var order = {
					user: activeOrders.user,
					orderKey: activeOrders.orderKey,
					amt: activeOrders.amt,
					date: activeOrders.date,
					itemName: activeOrders.itemName,
					qty: activeOrders.qty
				};

				activeOrders.totalAmount += order.amt;
				activeOrders.orders.push(order);
			});
		});

		usersOrderRef.on('child_changed', function (snapshot) {
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
//				console.log(activeOrders.orders);
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

			/*if (isChanged) {
				console.log("isChanged: ", isChanged);
				activeOrders.ordersArray
					.$save(index)
					.then(function (success) {
						console.log("success result: ", success);
					}).catch(function (error) {
						console.log(error);
					});
			}
			
			if (isRemoved) {
				console.log("isRemoved: ", isRemoved);
				activeOrders.ordersArray
					.$remove(index)
					.then(function (success) {
						console.log("success result: ", success);
					}).catch(function (error) {
						console.log(error);
					});
			}*/
		});

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
			//, amount, item, instructions, price, qty
			placeOrder: function(uid) {
				var orderRef = firebase.database().ref().child("Orders");
				var orderUidRef = orderRef.child(uid);

				orders.orderObj = $firebaseArray(orderUidRef);
				return orders.orderObj;
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