var gameController = function (element){
    var self = this;
    self.element = element;
    var cells = [];
    var positions = [];
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

            }
        self.element.append(tr);
        colorIndex = 1 - colorIndex;
        }
    };

    var cellGenerator = function(color, position){
        var cellSelf = this;
        cellSelf.color = color;
        cellSelf.position = position;
        cellSelf.currentPiece = null;
        cellSelf.cellElement = null;
        cellSelf.renderCell = function() {
            cellSelf.cellElement = ('<td>').addClass('cell').css('background-color', cellSelf.color);
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
    }


};
var game;
$(document).ready(function(){
    game = new gameController('#board');
    game.createBoard(8,8);
});