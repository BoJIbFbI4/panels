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
                url: '/diagrams/:projectID',
                templateUrl: 'templates/diagrams.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('diagramsPage2', {
                url: '/diagrams2/:projectID',
                templateUrl: 'templates/diagramsPage2.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('diagramsPage2.diagramsPage3', {
                url: '/diagrams3',
                templateUrl: 'templates/diagramsPage3.html',
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
