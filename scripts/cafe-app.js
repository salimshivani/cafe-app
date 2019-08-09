(function () {
    'use strict';
    
    var cafeApp = angular.module('CafeApp', []);

    cafeApp
        .controller('TitleController', TitleController)
        .controller('HomeScreenHeaderController', HomeScreenHeaderController)
        .controller('LoginScreenHeaderController', LoginScreenHeaderController)
        .factory('PageTitleService', PageTitleService);

    TitleController.$inject = ['PageTitleService'];
    function TitleController(PageTitleService) {
        var title = this;

        title.pageTitle = PageTitleService.title;
        console.log('title: ', title.pageTitle());
    }

    HomeScreenHeaderController.$inject = ['PageTitleService'];
    function HomeScreenHeaderController(PageTitleService) {
        var header = this, pageTitle = "Cafe App";

        header.title = PageTitleService.title(pageTitle);

        // header.login = function () {
        // };
    }

    LoginScreenHeaderController.$inject = ['PageTitleService'];
    function LoginScreenHeaderController(PageTitleService) {
        var header = this;
        var pageTitle = "Login";

        header.title = PageTitleService.title(pageTitle + " - ").split(" - ")[0];

        // header.login = function () {
        // };
    }

    function PageTitleService() {
        var pageTitle = this;
        
        pageTitle.title = 'Cafe App';

        return {
            title: function (title) {
                if (title === undefined || title === '') {
//                    pageTitle.title;
                } else if (title.includes(" - ")) {
					pageTitle.title = title.concat(pageTitle.title);
                } else {
                    pageTitle.title = title;
                }

                return pageTitle.title;
            }
        };
    }
})();