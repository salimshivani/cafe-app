(function () {
	'use strict';
    
	var customerApp = angular.module('CustomerApp', ['ngRoute', 'firebase', 'cp.ngConfirm']);

	customerApp
		.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
			var firebaseObj = {
				apiKey: "AIzaSyBDsD4wl8GTHCVPL_IJ8tbiBhKVuTVCfDI",
				authDomain: "cafe-app-52993.firebaseio.com",
				databaseURL: 'https://cafe-app-52993.firebaseio.com',
				projectId: "cafe-app-52993",
				storageBucket: "",
				messagingSenderId: "257963047060",
				appId: "1:257963047060:web:a2c7416276ba0730"
			};

			customerApp.app = firebase.initializeApp(firebaseObj);
			customerApp.auth = customerApp.app.auth();
			
			$routeProvider.when('../customer/place-order/place-order.html?index',{
				templateUrl:"../customer/place-order/place-order.html",
				controller:"PlaceOrderController"
			});
		}]);
	
	customerApp.controller('TitleController', TitleController);
	
	customerApp
		.controller('AppHeaderController', AppHeaderController)
		.controller('AppController', AppController);

	customerApp
		.controller('UserManagementController', UserManagementController);

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
		.controller('ViewItemsHeaderController', ViewItemsHeaderController)
		.controller('ViewItemsController', ViewItemsController);

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
		.factory('ItemService', ItemService)
		.factory('OrderService', OrderService);

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
	function TitleController (PageTitleService) {
        var title = this;

        title.pageTitle = PageTitleService.getTitle;
    }
	
	AppHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function AppHeaderController (PageTitleService, LoginService) {
		var header = this,
				pageTitle = "Cafe App",
				login = 'Login',
				signUp = 'Sign Up';

		header.title = PageTitleService.getTitle(pageTitle);
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../customer/login/login.html';
		}
		if (header.user.role === 'admin') {
			LoginService.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
	}
	
	AppController.$inject = ['LoginService'];
	function AppController (LoginService) {
		var app = this;
		
		app.user = LoginService.getUser();
		if (app.user !== null) {
			if (app.user.uid !== null 
				&& app.user.uid !== undefined 
				&& app.user.uid !== '' 
				&& app.user.role === 'admin') {
				console.log(app.user);
				window.location = '../customer/home/home.html';
			} else {
				// Redirect to Login
				window.location = '../customer/login/login.html';
			}
		} else {
			// Redirect to Login
			window.location = '../customer/login/login.html';
		}
	}

	UserManagementController.$inject = ['$ngConfirm', 'PageTitleService'];
	function UserManagementController ($ngConfirm, PageTitleService) {
		var user = this;
		user.isEmailVerified = false;
		user.headerTitle = "User Management";
		PageTitleService.getTitle(user.headerTitle);

		const urlParams = new URLSearchParams(window.location.search);

//		document.addEventListener('DOMContentLoaded', function() {
			// Get the action to complete.
			var mode = urlParams.get('mode');
			// Get the one-time code from the query parameter.
			var actionCode = urlParams.get('oobCode');
			// (Optional) Get the continue URL from the query parameter if available.
			var continueUrl = urlParams.get('continueUrl');
			// (Optional) Get the language code if available.
			var lang = urlParams.get('lang') || 'en';

			// Handle the user management action.
			switch (mode) {
				case 'resetPassword':
					// Display reset password handler and UI.
					user.headerTitle = "Reset Password";
					PageTitleService.getTitle(user.headerTitle);
					handleResetPassword(user, $ngConfirm, customerApp.auth, actionCode, continueUrl, lang);
					break;
				case 'recoverEmail':
					// Display email recovery handler and UI.
					PageTitleService.getTitle(user.headerTitle);
					handleRecoverEmail(customerApp.auth, actionCode, lang);
					break;
				case 'verifyEmail':
					// Display email verification handler and UI.
					user.headerTitle = "Verify Email";
					PageTitleService.getTitle(user.headerTitle);
					handleVerifyEmail(user, $ngConfirm, customerApp.auth, actionCode, continueUrl, lang);
					break;
				default:
					// Error: invalid mode.
			}
//		}, false);
	}

	handleResetPassword.$inject = ['$ngConfirm'];
	function handleResetPassword(user, $ngConfirm, auth, actionCode, continueUrl, lang) {
		// Localize the UI to the selected language as determined by the lang
		// parameter.
		var accountEmail;
		// Verify the password reset code is valid.
		auth.verifyPasswordResetCode(actionCode).then(function(email) {
			var accountEmail = email;

			// TODO: Show the reset screen with the user's email and ask the user for
			// the new password.
			if (user.password.length >= 6 && user.password === user.confPassword) {

				// Save the new password.
				auth.confirmPasswordReset(actionCode, user.password).then(function(resp) {
					// Password reset has been confirmed and new password updated.

					// TODO: Display a link back to the app, or sign-in the user directly
					// if the page belongs to the same domain as the app:
					// auth.signInWithEmailAndPassword(accountEmail, newPassword);

					// TODO: If a continue URL is available, display a button which on
					// click redirects the user back to the app via continueUrl with
					// additional state determined from that URL's parameters.
					console.log(user.password);
					console.log(resp);
					$ngConfirm({
						boxWidth: '75%',
						columnClass: 'medium',
						content: 'Password updated successfully.',
						title: 'Success',
						type: 'green',
						typeAnimated: true,
						useBootstrap: false,
						buttons: {
							ok: {
								btnClass: 'btn-green',
								text: "OK",
								action: function () {
//									window.location = '../login/login.html';
									return true;
								}
							}
						}
					});
				}).catch(function(error) {
					// Error occurred during confirmation. The code might have expired or the
					// password is too weak.
					$ngConfirm({
						boxWidth: '75%',
						columnClass: 'medium',
						content: error.message,
						title: 'Error',
						type: 'red',
						typeAnimated: true,
						useBootstrap: false,
						buttons: {
							ok: {
								btnClass: 'btn-red',
								text: "OK",
								action: function () {
									return true;
								}
							}
						}
					});
				});
			} else {
				$ngConfirm({
					boxWidth: '75%',
					columnClass: 'medium',
					content: 'Password does not match',
					title: 'Error',
					type: 'red',
					useBootstrap: false,
					buttons: {
						ok: {
							btnClass: 'btn-red',
							text: "OK",
							action: function () {
								return true;
							}
						}
					}
				});
			}
		}).catch(function(error) {
			// Invalid or expired action code. Ask user to try to reset the password
			// again.
			$ngConfirm({
				boxWidth: '75%',
				columnClass: 'medium',
				content: error.message,
				title: 'Error',
				type: 'red',
				typeAnimated: true,
				useBootstrap: false,
				buttons: {
					ok: {
						btnClass: 'btn-red',
						text: "OK",
						action: function () {
							return true;
						}
					}
				}
			});
		});
	}

	function handleRecoverEmail(auth, actionCode, lang) {
		// Localize the UI to the selected language as determined by the lang
		// parameter.
		var restoredEmail = null;
		// Confirm the action code is valid.
		auth.checkActionCode(actionCode).then(function(info) {
			// Get the restored email address.
			restoredEmail = info['data']['email'];

			// Revert to the old email.
			return auth.applyActionCode(actionCode);
		}).then(function() {
			// Account email reverted to restoredEmail

			// TODO: Display a confirmation message to the user.

			// You might also want to give the user the option to reset their password
			// in case the account was compromised:
			auth.sendPasswordResetEmail(restoredEmail).then(function() {
				// Password reset confirmation sent. Ask user to check their email.
			}).catch(function(error) {
				// Error encountered while sending password reset code.
			});
		}).catch(function(error) {
			// Invalid code.
		});
	}

	handleVerifyEmail.$inject = ['$ngConfirm'];
	function handleVerifyEmail(user, $ngConfirm, auth, actionCode, continueUrl, lang) {
		// Localize the UI to the selected language as determined by the lang parameter.
		// Try to apply the email verification code.
		auth.applyActionCode(actionCode).then(function(resp) {
			// Email address has been verified.

			// TODO: Display a confirmation message to the user.
			// You could also provide the user with a link back to the app.

			// TODO: If a continue URL is available, display a button which on
			// click redirects the user back to the app via continueUrl with
			// additional state determined from that URL's parameters.
			user.isEmailVerified = true;

			$ngConfirm({
				boxWidth: '75%',
				columnClass: 'medium',
				content: 'Your email is verified successfully. Thank you for becoming the part of The Hogspot Cafe.',
				title: 'Email Verified',
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
			console.log(user);
//			handleResetPassword(user, $ngConfirm, auth, actionCode, continueUrl, lang);
		}).catch(function(error) {
			// Code is invalid or expired. Ask the user to verify their email address again.
			console.log(error);
			var msg = '';
			if (error.code === 'auth/invalid-action-code') {
				msg = 'The link is already used or expired.'; 
			} else {
				msg = 'Error while verifying your email. Please try again later.';
			}
			$ngConfirm({
				boxWidth: '75%',
				columnClass: 'medium',
				content: msg,
				title: 'Error',
				type: 'red',
				typeAnimated: true,
				useBootstrap: false,
				buttons: {
					ok: {
						btnClass: 'btn-red',
						text: "OK",
						action: function () {
							return true;
						}
					}
				}
			});
		});
	}

	LoginScreenHeaderController.$inject = ['PageTitleService'];
	function LoginScreenHeaderController (PageTitleService) {
        var header = this;
        var pageTitle = "Customer Login";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
    }

	LoginScreenController.$inject = ['$firebaseAuth', 'UsersService', 'LoginService'];
	function LoginScreenController ($firebaseAuth, UsersService, LoginService) {
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
					var userDetails = UsersService.getUserDetails(firebaseUser.user.uid);

					userDetails.$ref().on('child_added', function (snapshot) {
						if (snapshot.val().role === 'customer') {
							LoginService.setUser(snapshot.key,
												 snapshot.val().email,
												 snapshot.val().name,
												 snapshot.val().mobile,
												 snapshot.val().role,
												 firebaseUser.user.uid);

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
	function LoginService ($location, $firebaseAuth) {
		var auth = $firebaseAuth();

		return {
			getUser: function () {
				if (localStorage.getItem('uid') === null ||
						localStorage.getItem('uid') === undefined ||
						localStorage.getItem('uid') === '') {
					
					return null;
				} else {
					return {
						key: localStorage.getItem('key'),
						email: localStorage.getItem('email'),
						name: localStorage.getItem('name'),
						phone: localStorage.getItem('phone'),
						role: localStorage.getItem('role'),
						uid: localStorage.getItem('uid')
					};
				}
			},
			setUser: function (key, regEmail, displayName, phoneNumber, role, uId) {
				localStorage.setItem('key', key);
				localStorage.setItem('email', regEmail);
				localStorage.setItem('name', displayName);
				localStorage.setItem('phone', phoneNumber);
				localStorage.setItem('role', role);
				localStorage.setItem('uid', uId);
			},
			logoutUser: function () {
				auth
					.$signOut()
					.then(function () {
						localStorage.removeItem('key');
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
	function UsersService ($firebaseArray) {
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
	function SignUpScreenHeaderController ($scope, PageTitleService) {
        var header = this;
        var pageTitle = "Sign Up";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
    }

	SignUpScreenController.$inject = ['$firebaseArray', 'SignUpService'];
	function SignUpScreenController ($firebaseArray, SignUpService) {
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
	}
	
	SignUpService.$inject = ['$firebaseArray']
	function SignUpService ($firebaseArray) {
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

	HomeScreenHeaderController.$inject = ['$scope', 'LoginService', 'PageTitleService'];
	function HomeScreenHeaderController ($scope, LoginService, PageTitleService) {
        var header = this,
			pageTitle = "Cafe App",
			login = 'Login',
			signUp = 'Sign Up';

		header.user = LoginService.getUser();
        header.title = PageTitleService.getTitle("Welcome, " + header.user.name + " - " + pageTitle);

		if (header.user === null) {
			window.location = '../customer/login/login.html';
		}
		if (header.user.role === 'admin') {
			LoginService.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
    }

	HomeScreenController.$inject = ['$firebaseAuth', 'LoginService'];
	function HomeScreenController ($firebaseAuth, LoginService) {
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

	ViewItemsHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function ViewItemsHeaderController (PageTitleService, LoginService) {
		var header = this,
			pageTitle = "View Items";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../customer/login/login.html';
		}
		if (header.user.role === 'admin') {
			LoginService.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
	}

	ViewItemsController.$inject = ['ItemService'];
	function ViewItemsController (ItemService) {
		var viewItems = this;
		var itemRef = firebase.database().ref().child("Items").orderByChild("availability").equalTo(true);
		var index = -1;

		viewItems.availability = false;
		viewItems.itemName = '';
		viewItems.price = 0;

		viewItems.items = [];
		viewItems.itemsArray = ItemService.getItems(itemRef);

		itemRef.on('child_added', function (snapshot) {
//			viewItems.itemKey = snapshot.key;
//			console.log('2');

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
//			console.log('3');

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

		viewItems.ePlaceOrder = function (index) {
			window.location = '../place-order/place-order.html?' + index;
		};

		viewItems.isFooterVisible = false;
	}

	ItemService.$inject = ['$firebaseArray'];
	function ItemService ($firebaseArray) {
		var orders = this;
//		var itemRef = firebase.database().ref().child("Items");
		var items = [];

		return {
			getItems: function (itemRef) {
				return $firebaseArray(itemRef);
			},
			addItem: function (itemRef) {
				return $firebaseArray(itemRef);
			}
		};
	}

	PlaceOrderHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function PlaceOrderHeaderController (PageTitleService, LoginService) {
		var header = this,
			pageTitle = "Place Order";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../customer/login/login.html';
		}
		if (header.user.role === 'admin') {
			LoginService.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
	}
	
	PlaceOrderController.$inject = ['ItemService', 'LoginService', 'OrderService'];
	function PlaceOrderController (ItemService, LoginService, OrderService) {
		var placeOrder = this;

		var itemRef = firebase.database().ref().child("Items")
												.orderByChild("availability")
												.equalTo(true);

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

		placeOrder.menuItems = ItemService.getItems(itemRef);
		placeOrder.menuItems.$loaded(function (success) {
//				console.log(success);
			let index = 0;
			if (window.location.href.split('?').length > 1) {
				index = window.location.href.split('?')[1];
			}
			placeOrder.itemName = success[index];
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
					customerUId: placeOrder.user.uid,
					customerKey: placeOrder.user.key,
					date: timeStamp,
					instructions: placeOrder.instructions,
					item: placeOrder.itemName.itemName,
					price: placeOrder.itemName.price,
					qty: placeOrder.quantity,
					isDelivered: false
				};
//				console.log(orderDetails);

				OrderService
					.placeOrder(orderRef)
					.$add(orderDetails)
					.then(function (success) {
						orderDetails.customerUId = null;
						orderDetails.customerKey = null;
//						OrderService.placeOrder(
						userOrderRef
							.child(placeOrder.user.uid)
							.child(placeOrder.user.key)
							.child("Orders")
							.child(success.key)
							.set(orderDetails)
							.then(function (success) {
								alert('Order Placed Successfully.');
							}).catch(function (error) {
								console.log(error);
							});
						placeOrder.errorQty = false;
						placeOrder.instructions = '';
						placeOrder.itemName = placeOrder.menuItems[0];
						placeOrder.quantity = 1;
						placeOrder.amount = placeOrder.quantity * placeOrder.itemName.price;
					}).catch(function (error) {
						console.log(error);
					});
			}
		};

		placeOrder.isFooterVisible = true;
	}
	
	ViewOrdersHeaderController.$inject = ['PageTitleService', 'LoginService'];
	function ViewOrdersHeaderController (PageTitleService, LoginService) {
		var header = this,
			pageTitle = "View Orders";

        header.title = PageTitleService.getTitle(pageTitle + " - ");
		header.title = header.title.split(" - ")[0];
		header.user = LoginService.getUser();
		if (header.user === null) {
			window.location = '../customer/login/login.html';
		}
		if (header.user.role === 'admin') {
			LoginService.logoutUser();
		}
		
		header.logout = LoginService.logoutUser;
	}
	
	ViewOrdersController.$inject = ['LoginService', 'OrderService'];
	function ViewOrdersController (LoginService, OrderService) {
		var viewOrders = this;
		viewOrders.user = LoginService.getUser();

		var usersUIdRef = firebase.database().ref()
									.child("Users")
									.child(viewOrders.user.uid);
		var pendingOrderRef = firebase.database().ref()
									.child("Orders")
									.orderByChild("isDelivered")
									.equalTo(false);
//		var customerRef = firebase.database().ref().child("Users");

		viewOrders.filter = ['Pending', 'Date', 'All Orders'];
		viewOrders.filterByType = viewOrders.filter[0];

		viewOrders.amt = 0;
		viewOrders.date = '';
		viewOrders.itemName = '';
		viewOrders.qty = 0;
		viewOrders.totalAmount = 0;

		OrderService.usersOrder(usersUIdRef).$loaded().then(function (result) {
			viewOrders.userKey = result[0].$id;
			viewOrders.usersPendingOrders = usersUIdRef.child(result[0].$id)
											.child("Orders")
											.orderByChild("isDelivered")
											.equalTo(false);

			viewOrders.ordersArray = OrderService.activeOrders(viewOrders.usersPendingOrders);
			viewOrders.ordersArray.$loaded().then(function (success) {
//				console.log(success);
//				console.log(viewOrders.ordersArray);
				angular.forEach(viewOrders.ordersArray, function(value, key) {
					viewOrders.totalAmount += value.amount;
				});

				viewOrders.usersPendingOrders.on('child_added', function (snapshot) {
					let index = viewOrders.ordersArray.findIndex(x => x.$id === snapshot.key);
//					console.log(index);
//					console.log(snapshot.val());
					if (index === -1) {
						viewOrders.totalAmount += snapshot.val().amount;
					}
				});
				
				viewOrders.usersPendingOrders.on('child_changed', function (snapshot) {
//					console.log(snapshot.key);
					var order = {
						orderKey: snapshot.key,
						amount: snapshot.val().amount,
						date: snapshot.val().date,
						instructions: snapshot.val().instructions,
						isDelivered: snapshot.val().isDelivered,
						item: snapshot.val().item,
						price: snapshot.val().price,
						qty: snapshot.val().qty
					};

					var index = viewOrders.ordersArray.findIndex(x => x.$id === snapshot.key);
					viewOrders.totalAmount -= viewOrders.ordersArray[index].amount;
					viewOrders.ordersArray[index] = order;

					viewOrders.ordersArray.$save(index).then(function (success) {
						console.log("success result: ", success);
						viewOrders.totalAmount += snapshot.val().amount;
					}).catch(function (error) {
						console.log(error);
					});
				});

				viewOrders.usersPendingOrders.on('child_removed', function (snapshot) {
//					console.log(JSON.stringify(snapshot.val(), null, 3));
//					console.log(snapshot.val());
//					console.log(viewOrders.ordersArray);

					var index = viewOrders.ordersArray.findIndex(x => x.$id === snapshot.key);
					let deletedAmount = viewOrders.ordersArray[index].amount;

					viewOrders.ordersArray.$remove(index).then(function (success) {
//						console.log("success result: ", success);
						if (snapshot.val().isDelivered) {
							alert("Order delivered successfully.");
						} else {
							alert("Order cancelled.");
						}
						viewOrders.totalAmount -= deletedAmount;
					}).catch(function (error) {
						console.log(error);
					});

				});
			}).catch(function (error) {
				console.log(error);
			});
		}).catch(function (error) {
			console.log(error);
		});

		viewOrders.applyFilter = function (filter) {
			if (filter === 'Pending') {
				viewOrders.ordersArray = OrderService.activeOrders(viewOrders.usersPendingOrders);
			} else if (filter === 'All Orders') {
				var allOrders = usersUIdRef.child(viewOrders.userKey)
											.child("Orders").limitToLast(100);

				viewOrders.ordersArray = OrderService.usersOrder(allOrders);
			} else if (filter === 'Date') {
				var ordersByDate = usersUIdRef.child(viewOrders.userKey)
												.child("Orders").orderByChild("date");

				viewOrders.ordersArray = OrderService.usersOrder(ordersByDate);
			}
			viewOrders.totalAmount = 0;
			viewOrders.ordersArray.$loaded(function (success) {
				angular.forEach(viewOrders.ordersArray, function(value, key) {
					viewOrders.totalAmount += value.amount;
				});
			});
		};

		viewOrders.isFooterVisible = true;
	}

	OrderService.$inject = ['$firebaseArray'];
	function OrderService ($firebaseArray) {
		var orders = this;

		return {
			usersOrder: function (usersOrderRef) {
				return $firebaseArray(usersOrderRef);
			},
			activeOrders: function (orderUidRef) {
				return $firebaseArray(orderUidRef);
			},
			placeOrder: function (orderRef) {
				return $firebaseArray(orderRef);
			}
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
                } else if (title.includes(" - Cafe App")) {
                    pageTitle.title = title;
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