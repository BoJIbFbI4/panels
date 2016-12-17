
angular.module('Route', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('auth', {
                url: '/login',
                templateUrl: 'views/authorization.html'

            })
            .state('companies', {
                url: '/companies',
                templateUrl: 'views/companies.html',
                controller: 'CompaniesCtrl'

            })
            .state('projects', {
                url: '/projects/:companyID',
                templateUrl: 'views/projects.html'
            })
            .state('diagrams', {
                url: '/diagrams',
                templateUrl: 'views/diagrams.html'
            })
            .state('createproject', {
                url: '/createProject',
                templateUrl: 'views/createProject.html'
            });
    });
