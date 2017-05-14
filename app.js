var game = angular.module("game", [])

game.controller("gameCtrl", ["$scope", function ($scope) {

    initGame();

    // == scope functions ==
    $scope.move = function (cell) {
        if ($scope.winner) {
            alert("Il gioco e' terminato. Ricomincia :-)");
            return;
        }
        cell.v = $scope.currentPlayer;
        checkBoard();
        $scope.currentPlayer = getNextPlayer($scope.currentPlayer);
    };
    $scope.newGame = function () {
        initGame();
    };

    // == utility functions ==

    // initialize the board and all variables
    function initGame () {
    	$scope.currentPlayer = getRandomPlayer();
	    $scope.winner = null;

	    //cell model {v -> value, w -> winning};
	    $scope.board = [
		    [ { v: '-', w: false }, { v: '-', w: false }, { v: '-', w: false } ],
		    [ { v: '-', w: false }, { v: '-', w: false }, { v: '-', w: false } ],
		    [ { v: '-', w: false }, { v: '-', w: false }, { v: '-', w: false } ]
	  ];
    }
    // returns the cell
    function cell (row, column) {
        return $scope.board[row][column];
    }

    // gets a random player to start with
    function getRandomPlayer () {
    	return Math.floor(Math.random() * 2) === 0 ? "X" : "O";
    }

    // returns the next player
    function getNextPlayer (player) {
        return {
            O: 'X',
            X: 'O'
        }[player];
    };

    function getRow (idx) {
    	return $scope.board[idx];
    };

    function getCols (idx) {
    	return $scope.board.map((row) => {return row[idx];});
    };

    // checks the board and declare winner if any.
    function checkBoard() {
        var winner, empty = false;
        // check board
        for (var i = 0; i < 3; i++) {
            // horizontally
            if (cell(i, 0).v !== '-' && cell(i, 0).v == cell(i, 1).v && cell(i, 1).v == cell(i, 2).v) {
                winner = cell(i, 0).v;
                // marking winning row
                getRow(i).map(c => {c.w = true;});
            }
        	// vertically
            if (cell(0, i).v !== '-' && cell(0, i).v == cell(1, i).v && cell(1, i).v == cell(2, i).v) {
                winner = cell(0, i).v;
                // marking winning column
                getCols(i).map(c => {c.w = true;});
            }
            if (winner) {
            	break;
            }
        }

        // diagonally
        if (cell(0, 0).v !== '-' && cell(0, 0).v == cell(1, 1).v && cell(1, 1).v == cell(2, 2).v) {
            winner = cell(0, 0).v;
            // marking winning diagonal
            [cell(0, 0), cell(1, 1), cell(2, 2)].map(c => {c.w = true;});
        } else if (cell(0, 2).v !== '-' && cell(0, 2).v == cell(1, 1).v && cell(1, 1).v == cell(2, 0).v) {
            winner = cell(0, 2).v;
            // marking winning diagonal
            [cell(0, 2), cell(1, 1), cell(2, 0)].map(c => {c.w = true;});
        }

		// check for any empty cell
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (cell(i, j).v === '-') {
                	empty = true;
                	break;
                }
            }
            if (empty) {
            	break;
            }
        }
		if (!empty && !winner) {
			// the board is full and nobody wins.
			winner = "Nobody";
		}

        if (winner) {
            $scope.winner = winner;
        }
    }
}]);

game.directive("row", function () {
	return {
		restrict: "E",
		replace: true,
		templateUrl: "directives/row.html",
		scope: {
			rowObject: "=",
			moveRowFunction: "&"
		},
	}
});
game.directive("cell", function () {
	return {
		restrict: "E",
		replace: true,
		templateUrl: "directives/cell.html",
		requires: "^^row",
		scope: {
			cellObject: "=",
			moveCellFunction: "&"
		},
		link: function(scope, elements, attrs) {
			scope.isTaken = function() {
				return scope.cellObject.v !== '-';
			};
		}
	}
});
