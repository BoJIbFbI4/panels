angular.module('Route', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('auth', {
                url: '/login',
                templateUrl: 'templates/authorization.html'

            })
            .state('companies', {
                url: '/companies',
                templateUrl: 'templates/companies.html',
                controller: 'CompaniesCtrl',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }

            })
            .state('projects', {
                url: '/projects/:companyID/:managerID',
                templateUrl: 'templates/projects.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('diagrams', {
                url: '/diagrams',
                templateUrl: 'templates/diagrams.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('createproject', {
                url: '/createProject',
                templateUrl: 'templates/createProject.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            });
    });
