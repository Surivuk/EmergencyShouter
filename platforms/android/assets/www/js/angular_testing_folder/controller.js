var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
        $scope.firstName = "John";
        $scope.lastName = "Doe";
    })
    .directive('hello', function() {
        return {
            restrict: 'A',
            replace: 'true',
            templateUrl: "test.html"
        };
    })
    .service('PleaseWork', function() {
        this.add = function(a, b) {
            return a + b
        };
    })
    .controller('testCtrl', function($scope, PleaseWork) {
        $scope.doIncrement = function() {
            $scope.answer = PleaseWork.add($scope.number, 1);
        }
    });

document.getElementById('a').innerHTML = 'Loaded.';
