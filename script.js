/**
 * Created by Lalim on 3/23/16.
 */

var gameController = function(element){
    var self = this;
    this.element = $(element);
    var row = [];
    var cells = [];
    var cellPosition =[];
    var pieces = [];

    this.createBoard = function(height,width){
        var colors = ['black','white'];
        var colorIndex = 0;

        for (var i = 0; i < height; i++){
            var tr = $('<tr>');
            for( var j = 0; j < width; j++){
                var newCell = new cellGenerator(colors[colorIndex], {x:i,y:j});
                colorIndex = 1 - colorIndex;
                var cellElement = newCell.renderCell();
                cells.push(newCell);
                tr.append(cellElement);
            }
            this.element.append(tr);
            colorIndex = 1 - colorIndex;
        }

    };



    var cellGenerator = function(color, position){
        var self = this;
        this.color = color;
        this.position = position;
        this.currentPiece = null;
        this.cellElement = null;
        this.renderCell = function (){
            self.cellElement = $('<td>').addClass('cell').css('background-color',this.color);
            return self.cellElement;
        };
        this.cellPosition = function(){
            return this.position;
        };
        this.setCurrentPiece = function(piece){
            this.currentPiece = piece;
        };
        this.getCurrentPiece = function(piece){
            return this.currentPiece;
        };
    };

    var pieceGenerator = function(){
        var self = this;
        this.pieceElement = null;
        this.renderPiece = function (){
            self.pieceElement = $('<div>').addClass('piece');
            return self.pieceElement;
        }
    }
};

var game;
$(document).ready(function(){
    game = new gameController('#board');
    game.createBoard(8,8);
});