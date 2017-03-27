(function () {
    'use strict';
    angular.module('panelsApp')
        .service('loginService', [, function () {
            var login;

            function setLogin(authorizationData){
                if(authorizationData){ 
                    login = authorizationData;
                }
              
            }

            function getLogin(){
                return login;

            }
            return {
                setLogin: setLogin,
                getLogin: getLogin
            }

        }]);

}());