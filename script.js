var gameController = function (element){
    var self = this;
    self.element = $(element);
    var cells = [];
    var cellPosition = [];
    var pieces = [];

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
        cellSelf.getCurrentPiece = function(piece){
            return cellSelf.currentPiece;
        };
        cellSelf.getColor = function(){
            return cellSelf.color;
        }
    };

    var pieceGenerator = function(moveRule){
        var pieceSelf = this;
        pieceSelf.pieceElement = null;
        pieceSelf.moveRule = moveRule;
        pieceSelf.cellElement = null;
        pieceSelf.setCurrentCell = function(cell){
            pieceSelf.pieceElement = cell;
        };
        pieceSelf.renderPiece = function(){
            pieceSelf.pieceElement = $('<div>').addClass('piece');
            pieceSelf.pieceElement.click(function(){
                pieceSelf.clickHandler(pieceSelf);
            });
            return pieceSelf.pieceElement;
        };
        pieceSelf.clickHandler = function(pieceElement){
            console.log("I was clicked", pieceElement);
        }
    };

    var playerGenerator = function(color){
        var playSelf = this;
        playSelf.color = color;
        playSelf.getColor = function(){
            return playSelf.color;
        };

    };
};

var pieceData = [
    {
        pieceClass:"piece",
        pieceCount: 12,
        placementRule:function(cell){
            if (cell.getColor() == 'black'){
                return true;
            }else{
                return false;
            }
        },
        movementRules:function(x,y){
            var vectors = [
                [1,-1],
                [1,1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for(var i = 0;i < vectors.length;i++){
                for(var j = 1;j < vectors[i].length;j++){
                    var possibleCoor = {
                        x:x+(vectors[i][0]*j),
                        y:y+(vectors[i][1]*j)
                    };
                    totalPossible.push(possibleCoor);
                    if (totalPossible[i].x < 8 && totalPossible[i].x >= 0 && totalPossible[i].y < 8 && totalPossible[i].y >=0){
                        validPossible.push(totalPossible[i]);
                    }
                }
            }
            return validPossible;
        }
    },
    {
        pieceClass:"piece",
        pieceCount: 12,
        placementRule:function(cell){
            if (cell.getColor() == 'black'){
                return true;
            }else{
                return false;
            }
        },
        movementRules:function(x,y) {
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
    }

];
var game;
$(document).ready(function(){
    game = new gameController('#board');
    game.createBoard(8,8);
});