var app = angular.module('myApp', []);

app.directive('ContestantList', function() {
        return {
            restrict: 'A',
            scope: {},
            templateUrl: 'contestant_list.html',
            replace: true,
            controller: 'ContestantListCtrl',
            controllerAs: 'ctrl'
        };
    })
    .controller('ContestantListCtrl', function() {

        this.contestants = [
            { firstName: 'Rachel', lastName: 'Washington' },
            { firstName: 'Joshua', lastName: 'Foster' },
            { firstName: 'Samuel', lastName: 'Walker' },
            { firstName: 'Phyllis', lastName: 'Reynolds' }
        ];

    })
    .directive('cContestantEditorForm', function() {
        return {
            scope: {
                contestants: '='
            },
            templateUrl: 'contestant_editor.html',
            replace: true,
            controller: 'ContestantEditorFormCtrl',
            controllerAs: 'ctrl'
        };
    })
    .controller('ContestantEditorFormCtrl', function($scope) {

        this.contestant = {};

        this.save = function() {
            $scope.contestants.push(this.contestant);
            this.contestant = {};
        };

    });
