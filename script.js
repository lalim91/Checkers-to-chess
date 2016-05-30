
var gameController = function (element){
    var self = this;
    self.element = $(element);
    var locked = false;
    var turn = null;
    var cells = [];
    var cellPosition = [];
    var pieces = [];
    var players = [];
    var currentPlayer = 0;
    var player1Pieces = [];
    var player2Pieces = [];
    var highlightedCells = [];

    self.createBoard = function(height,width){
        var colors = ['black','white'];
        var colorIndex = 0;
        for (var i = 0; i < height; i++){
            var tr = $('<tr>');
            var newRow = [];
            for (var j = 0; j < width; j++){
                var newCell = new cellGenerator(colors[colorIndex],{x:i,y:j});
                colorIndex = 1 - colorIndex;
                var cell = newCell.renderCell();
                cells.push(newCell);
                newRow.push(newCell);
                tr.append(cell);

            }
        self.element.append(tr);
        colorIndex = 1 - colorIndex;
        cellPosition.push(newRow);
        }
        console.log(cellPosition);
    };
    self.getCellByPosition = function(){
        var CellByPosition = cellPosition[i];
    };
    self.initialPlayer = function(colorArray){
        self.playerOne = new playerGenerator(colorArray[0]);
        self.playerTwo = new playerGenerator(colorArray[1]);
        players.push(self.playerOne,self.playerTwo);
    };
    self.setTurns = function(){
        if (currentPlayer == 0){
            turn = players[0];
            players[1].disablePieces(player2Pieces);
            currentPlayer = 1;
        }else if (currentPlayer == 1){
            turn = players[1];
            players[0].disablePieces(player1Pieces);
            currentPlayer = 0;
        }


    };
    self.createPiece = function(){
        var newPiece = null;
        var pieceElement = null;
        var result = null;
        for (var p = 0; p < pieceData.length; p++){
            if (p == 0){
                for (var i = 0; i < cells.length && pieceData[p].pieceCount > 0; i++){
                    result = pieceData[p].placementRule(cells[i]);
                    if(result){
                        pieceData[p].pieceCount--;
                        newPiece = new pieceGenerator(pieceData[p].movementRules);
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background', self.playerOne.getColor());
                        newPiece.setCurrentCell(cells[i]);
                        newPiece.setPlayer(self.playerOne);
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        player1Pieces.push(pieceElement);
                        cells[i].setCurrentPiece(newPiece);
                    }
                }
            }else if (p == 1){
                for (i = 63; i > 0 && pieceData[p].pieceCount > 0; i--){
                    result = pieceData[p].placementRule(cells[i]);
                    if(result){
                        pieceData[p].pieceCount--;
                        newPiece = new pieceGenerator(pieceData[p].movementRules);
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background', self.playerTwo.getColor());
                        newPiece.setCurrentCell(cells[i]);
                        newPiece.setPlayer(self.playerTwo);
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        player2Pieces.push(pieceElement);
                        cells[i].setCurrentPiece(newPiece);
                    }
                }
            }
        }
    };


    var cellGenerator = function(color, position){
        var cellSelf = this;
        cellSelf.color = color;
        cellSelf.position = position;
        cellSelf.currentPiece = null;
        cellSelf.cellElement = null;
        cellSelf.renderCell = function() {
            cellSelf.cellElement = $('<td>').addClass('cell').css('background-color', cellSelf.color);
            return cellSelf.cellElement;
        };
        cellSelf.cellPosition = function(){
            return cellSelf.position;
        };
        cellSelf.setCurrentPiece = function(piece){
            cellSelf.currentPiece = piece;
        };
        cellSelf.getCurrentPiece = function(){
            return cellSelf.currentPiece;
        };
        cellSelf.getColor = function(){
            return cellSelf.color;
        };
        cellSelf.indicateMovesWithHighlight = function(){
          cellSelf.cellElement.addClass('highlight ','ui-widget-header');
        };
        cellSelf.removeHighlight = function(){
            cellSelf.cellElement.removeClass('highlight ','ui-widget-header');
        };
        cellSelf.findPossibleMoves = function(){
            highlightedCells = [];
            console.log("My move rule: ",
            cellSelf.currentPiece.moveRule(cellSelf.position.x,cellSelf.position.y));
            cellSelf.moves = cellSelf.currentPiece.moveRule(cellSelf.position.x,cellSelf.position.y);
            cellSelf.checkCellForPiece();
            cellSelf.highlightPossibleMoves();

        };
        cellSelf.checkCellForPiece = function(){
            for (var i = 0; i < cellSelf.moves.length; i++){
                console.log(cellSelf.moves[i]);
                if (cellPosition[cellSelf.moves[i].x][cellSelf.moves[i].y].currentPiece == null){
                    highlightedCells.push(cellPosition[cellSelf.moves[i].x][cellSelf.moves[i].y]);
                }
            }
            return highlightedCells;
        };
        cellSelf.highlightPossibleMoves = function(){
            for(var i = 0; i < highlightedCells.length; i++){
                highlightedCells[i].indicateMovesWithHighlight();            }
        };
        cellSelf.removeHighlightedMoves= function(){
            for(var i = 0; i < highlightedCells.length; i++){
                highlightedCells[i].removeHighlight();            }
        };
        cellSelf.drop = function(){
            $('.highlight').droppable({
                tolerance:'fit',
                accept: 'cellSelf.pieceElement',
                drop: function(event, ui){
                    cellSelf.removeHighlight();
                    self.setTurns();
                }
            });
        }
    };

    var pieceGenerator = function(moveRule){
        var pieceSelf = this;
        pieceSelf.class = "ui-widget-content";
        pieceSelf.onmousedown = "shift('pieceSelf.pieceElement')";
        pieceSelf.checked = false;
        pieceSelf.pieceElement = null;
        pieceSelf.moveRule = moveRule;
        pieceSelf.cellElement = null;
        pieceSelf.player = null;
        pieceSelf.setPlayer = function(player){
            pieceSelf.player = player;
        };
        pieceSelf.setCurrentCell = function(cell){
            pieceSelf.cellElement = cell;
        };
        pieceSelf.renderPiece = function(){
            pieceSelf.pieceElement = $('<div>').addClass('piece');
            pieceSelf.pieceElement.on('click',function(){
                pieceSelf.checked = true;
                if (turn == pieceSelf.player){
                    pieceSelf.clickHandler(pieceSelf);
                }
            });
            return pieceSelf.pieceElement;
        };
        pieceSelf.clickHandler = function(pieceElement){
            console.log("I was clicked", pieceElement);
            pieceSelf.cellElement.removeHighlightedMoves();
            pieceSelf.cellElement.findPossibleMoves();
            if (pieceSelf.checked == true){
                pieceSelf.drag();
                //pieceSelf.dropSpot();
                pieceSelf.cellElement.drop();
            }
        };
        pieceSelf.drag = function(){
            pieceSelf.pieceElement.draggable();
        };
    };

    var playerGenerator = function(color){
        var playSelf = this;
        playSelf.turn = false;
        playSelf.color = color;
        playSelf.getColor = function(){
            return playSelf.color;
        };
        playSelf.disablePieces = function(piecesArray){
            for (var i = 0; i < piecesArray.length; i++){
                piecesArray[i].off('click');
            }
        }
    };
};

var pieceData = [
    {
        pieceClass: "piece",
        pieceCount: 12,
        placementRule: function (cell) {
            if (cell.getColor() == 'black') {
                return true;
            } else {
                return false;
            }
        },
        movementRules: function (x, y) {
            var vectors = [
                [1, -1],
                [1, 1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for (var i = 0; i < vectors.length; i++) {
                for (var j = 1; j < vectors[i].length; j++) {
                    var possibleCoor = {
                        x: x + (vectors[i][0] * j),
                        y: y + (vectors[i][1] * j)
                    };
                    totalPossible.push(possibleCoor);
                    if (totalPossible[i].x < 8 && totalPossible[i].x >= 0 && totalPossible[i].y < 8 && totalPossible[i].y >= 0) {
                        validPossible.push(totalPossible[i]);
                    }
                }
            }
            return validPossible;
        }
    },
    {
        pieceClass: "piece",
        pieceCount: 12,
        placementRule: function (cell) {
            if (cell.getColor() == 'black') {
                return true;
            } else {
                return false;
            }
        },
        movementRules: function (x, y) {
            var vectors = [
                [-1, 1],
                [-1, -1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for (var i = 0; i < vectors.length; i++) {
                for (var j = 1; j < vectors[i].length; j++) {
                    var possibleCoor = {
                        x: x + (vectors[i][0] * j),
                        y: y + (vectors[i][1] * j)
                    };
                    totalPossible.push(possibleCoor);
                    if (totalPossible[i].x < 8 && totalPossible[i].x >= 0 && totalPossible[i].y < 8 && totalPossible[i].y >= 0) {
                        validPossible.push(totalPossible[i]);
                    }
                }
            }
            return validPossible;
        }
    }

];
var game;
$(document).ready(function(){
    game = new gameController('#board');
    game.createBoard(8,8);
    game.initialPlayer(['yellow','blue']);
    game.createPiece(pieceData);
    game.setTurns();
});

