
var gameController = function (element){
    var self = this;
    self.element = $(element);
    var locked = false;
    var turn = null;
    var cells = [];
    this.cells = cells;
    var cellPosition = [];
    var pieces = [];
    self.pieces = pieces;
    var players = [];
    var currentPlayer = 0;
    var player1Pieces = [];
    var player2Pieces = [];
    var highlightedCells = [];
    self.currentlyDraggingPiece = null;
    self.oldCell = null;
    self.newCell = null;

    self.createBoard = function(height,width){
        var colors = ['black','white'];
        var colorIndex = 0;
        for (var i = 0; i < height; i++){
            var tr = $('<tr>');
            var newRow = [];
            for (var j = 0; j < width; j++){
                var newCell = new cellGenerator(colors[colorIndex],{x:i,y:j},self);
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
                        newPiece = new pieceGenerator(pieceData[p].movementRules,self,i);
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background', self.playerOne.getColor());
                        newPiece.setCurrentCell(cells[i]);
                        cells[i].setCurrentPiece(newPiece);
                        newPiece.setPlayer(self.playerOne);
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        player1Pieces.push(pieceElement);
                    }
                    newPiece.drag();
                }
            }else if (p == 1){
                for (i = 63; i > 0 && pieceData[p].pieceCount > 0; i--){
                    result = pieceData[p].placementRule(cells[i]);
                    if(result){
                        pieceData[p].pieceCount--;
                        newPiece = new pieceGenerator(pieceData[p].movementRules,self,i);
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background', self.playerTwo.getColor());
                        newPiece.setCurrentCell(cells[i]);
                        cells[i].setCurrentPiece(newPiece);
                        newPiece.setPlayer(self.playerTwo);
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        player2Pieces.push(pieceElement);
                    }
                    newPiece.drag();
                }
            }
        }
    };
    self.setTurns = function(){
        if (currentPlayer == 0){
            //turn = players[0];
            players[1].disablePieces(player2Pieces);
            players[0].enablePieces(player1Pieces);
            currentPlayer = 1;
        }else if (currentPlayer == 1){
            //turn = players[1];
            players[0].disablePieces(player1Pieces);
            players[1].enablePieces(player2Pieces);
            currentPlayer = 0;
        }
    };
    self.dragTracker = function(piece, id){
        for (var i = 0; i < pieces.length; i++){
            if (pieces[i].id == id){
                self.currentlyDraggingPiece = pieces[i];
                //console.log('current dragged piece: ',self.currentlyDraggingPiece);
            }
        }
        self.oldCell = self.currentlyDraggingPiece.cellElement;
        self.oldCell.removeCurrentPiece();
        self.currentlyDraggingPiece.removeCurrentCell();
        //console.log('oldCell: ',self.oldCell);
    };
    self.dropTracker = function(cell, row, col){
        for (var i = 0; i < cells.length; i++){
            if (cells[i].row == row && cells[i].col == col){
                self.newCell = cells[i];
                //console.log('newCell: ',self.newCell);
            }
        }

    };
    self.removeDrop = function(event, ui){
        $('.highlight').droppable('destroy');
        $('.highlight').removeClass('highlight');
        //cellSelf.currentPiece.checked = false;
        //console.log(cellSelf.currentPiece.checked);
    };
    self.refresh = function(){
        self.currentlyDraggingPiece = null;
        self.oldCell = null;
        self.newCell = null;
    };
    self.updateCells = function(event, ui){
        self.refresh();
        console.log('ui draggable: ',$(ui.draggable).attr('id'));
        var id = $(ui.draggable).attr('id');
        self.dragTracker(ui.draggable, id);
        console.log('event Target Row: ',$(event.target).attr('row'));
        console.log('event Target Col: ',$(event.target).attr('col'));
        var row = $(event.target).attr('row');
        var col = $(event.target).attr('col');
        self.dropTracker(event.target, row, col);
        self.removeDrop();
        self.newCell.setCurrentPiece(self.currentlyDraggingPiece);
        self.currentlyDraggingPiece.setCurrentCell(self.newCell);
        $(self.newCell.cellElement).append(ui.draggable);
        $('#draggableHelper').remove();
        console.log('current dragged piece: ',self.currentlyDraggingPiece);
        console.log('oldCell: ',self.oldCell);
        console.log('newCell: ',self.newCell);
        //console.log('cells:', self.cells);
        self.setTurns();



    };
    var cellGenerator = function(color, position,game){
        var cellSelf = this;
        cellSelf.color = color;
        cellSelf.position = position;
        cellSelf.game = game;
        cellSelf.currentPiece = null;
        cellSelf.cellElement = null;
        cellSelf.row = cellSelf.position.x;
        cellSelf.col = cellSelf.position.y;
        cellSelf.currentPieceId = null;

        cellSelf.renderCell = function() {
            cellSelf.cellElement = $('<td row="' + cellSelf.row + '" col="' + cellSelf.col + '">').addClass('cell');
            cellSelf.setBackgroundColor();
            return cellSelf.cellElement;
        };

        cellSelf.setBackgroundColor = function(){
            if (cellSelf.color == "black"){
                cellSelf.cellElement.addClass('black');
            }else if (cellSelf.color == "white"){
                cellSelf.cellElement.addClass('white');
            }

        };
        cellSelf.cellPosition = function(){
            return cellSelf.position;
        };
        cellSelf.setCurrentPiece = function(piece){
            cellSelf.currentPiece = piece;
            cellSelf.currentPieceId = piece.id;
        };
        cellSelf.getCurrentPiece = function(){
            return cellSelf.currentPiece;
        };
        cellSelf.removeCurrentPiece = function(){
            cellSelf.currentPiece = null;
            cellSelf.currentPieceId = null;
            //cellSelf.moves = null;
        };
        cellSelf.getColor = function(){
            return cellSelf.color;
        };
        cellSelf.indicateMovesWithHighlight = function(){
            cellSelf.cellElement.addClass('highlight');
        };
        cellSelf.removeHighlight = function(){
            cellSelf.cellElement.removeClass('highlight');
        };
        cellSelf.findPossibleMoves = function(event, ui){
            highlightedCells = [];
            //cellSelf.game.refresh();
            console.log('current piece', cellSelf.currentPiece);
            console.log("My move rule: ",
            cellSelf.currentPiece.moveRule(cellSelf.position.x,cellSelf.position.y));
            cellSelf.moves = cellSelf.currentPiece.moveRule(cellSelf.position.x,cellSelf.position.y);
            cellSelf.checkCellForPiece();
            cellSelf.highlightPossibleMoves();
            cellSelf.drop();

        };
        cellSelf.checkCellForPiece = function(){
            for (var i = 0; i < cellSelf.moves.length; i++){
                console.log(cellSelf.moves[i]);
                if (cellPosition[cellSelf.moves[i].x][cellSelf.moves[i].y].currentPiece == null){
                    highlightedCells.push(cellPosition[cellSelf.moves[i].x][cellSelf.moves[i].y]);
                }else if(cellPosition[cellSelf.moves[i].x][cellSelf.moves[i].y].currentPiece.player != cellSelf.currentPiece.player){
                    console.log('not match');
                }
            }
            return highlightedCells;
        };
        cellSelf.highlightPossibleMoves = function(){
            for(var i = 0; i < highlightedCells.length; i++){
                highlightedCells[i].indicateMovesWithHighlight();
                console.log('cells receive drop');
            }
        };

        cellSelf.removeHighlightedMoves= function(){
            for(var i = 0; i < highlightedCells.length; i++){
                highlightedCells[i].removeHighlight();            }
        };
        cellSelf.drop = function(){
            $('.highlight').droppable({
                accept:pieceGenerator.pieceElement,
                hoverClass:'hovered',
                drop:function(event, ui){
                    cellSelf.game.updateCells(event,ui);

                }
            });

        };
    };

    var pieceGenerator = function(moveRule,game,id){
        var pieceSelf = this;
        pieceSelf.checked = false;
        pieceSelf.id = id;
        pieceSelf.pieceElement = null;
        pieceSelf.moveRule = moveRule;
        pieceSelf.game = game;
        pieceSelf.cellElement = null;
        pieceSelf.cellElementRow = null;
        pieceSelf.cellElementCol = null;
        pieceSelf.player = null;
        pieceSelf.setPlayer = function(player){
            pieceSelf.player = player;
        };
        pieceSelf.setCurrentCell = function(cell){
            pieceSelf.cellElement = cell;
            pieceSelf.cellElementRow = cell.row;
            pieceSelf.cellElementCol = cell.col;
        };
        pieceSelf.removeCurrentCell = function(){
            pieceSelf.cellElement = null;
            pieceSelf.cellElementRow = null;
            pieceSelf.cellElementCol = null;

        };
        pieceSelf.renderPiece = function(){
            pieceSelf.pieceElement = $('<div id="' + pieceSelf.id + '">').addClass('piece');
            return pieceSelf.pieceElement;
        };
        pieceSelf.drag = function(){
            pieceSelf.pieceElement.draggable({
                containment:'#board',
                revert:"invalid",
                tolerance:'fit',
                start:function(){
                    pieceSelf.cellElement.findPossibleMoves();
                },
                stop:pieceSelf.game.removeDrop,
                helper:pieceSelf.help
            });
        };
        pieceSelf.help = function (){
            return '<div id="draggableHelper" class="piece"></div>';
        }

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
                piecesArray[i].draggable('disable');
            }
        };
        playSelf.enablePieces = function(piecesArray){
            for (var i = 0; i < piecesArray.length; i++){
                piecesArray[i].draggable('enable');
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

