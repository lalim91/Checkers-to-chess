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
            var newRow = [];


            for( var j = 0; j < width; j++){
                var newCell = new cellGenerator(colors[colorIndex], {x:i,y:j});
                colorIndex = 1 - colorIndex;
                var cellElement = newCell.renderCell();
                cells.push(newCell);
                newRow.push(newCell);
                tr.append(cellElement);
            }
            this.element.append(tr);
            colorIndex = 1 - colorIndex;
            cellPosition.push(newRow);

        }
        console.log(cellPosition);
    };

    this.initializePlayer =function(colorArray){
        this.playerOne = new playerGenerator(colorArray[0]);
        this.playerTwo = new playerGenerator(colorArray[1]);

    };

    this.createPiece = function(pieceData) {
        var newPiece = null;
        var pieceElement = null;
        var result = null;
        for (var p = 0; p < pieceData.length; p++) {
            if (p == 0){
                for (var i = 0; i < cells.length && pieceData[p].pieceCount > 0; i++) {
                    result = pieceData[p].placementRule(cells[i]);
                    if (result) {
                        pieceData[p].pieceCount--;
                        newPiece = new pieceGenerator();
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background', this.playerOne.getColor());
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        cells[i].setCurrentPiece(newPiece);
                    }
                    console.log(result);
                }
            }else if (p == 1){
                for (i = 63; i>0 && pieceData[p].pieceCount > 0; i--){
                    result = pieceData[p].placementRule(cells[i]);
                    if (result){
                        pieceData[p].pieceCount--;
                        newPiece = new pieceGenerator();
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background',this.playerTwo.getColor());
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        cells[i].setCurrentPiece(newPiece);
                    }
                    console.log(result);
                }
            }
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
        this.getColor = function (){
            return this.color;
        }
    };

    var pieceGenerator = function(moveRule){
        var self = this;
        this.pieceElement = null;
        this.moveRule = moveRule;
        this.renderPiece = function (){
            self.pieceElement = $('<div>').addClass('piece');
            return self.pieceElement;
        };
        this.setMovement = function (){
            return this.moveRule;
        }

    };

    var playerGenerator = function (color) {
        var self = this;
        this.color = color;
        this.getColor = function () {
            //this.pieceElement.css('background-color',this.color);
            return this.color;
        }
    };
};
var pieceData = [
    {
        pieceClass: 'piece',
        pieceCount: 12,
        placementRule: function (cell) {
            if (cell.getColor() == 'black') {
                return true;
            }
            else {
                return false;
            }
        },
            movementRules: function(x,y){
                var vectors= [
                    [1,-1],
                    [1, 1]
                ];
                var possibles=[];
                for(var i=0; i<vectors.length;i++){
                    for(var j=1;j<vectors[i].length;j++){
                        var possible_coord = {
                            x:x+(vectors[i][0]*j),
                            y:y+(vectors[i][1]*j)
                        };
                        possibles.push(possible_coord);
                    }
                }
                return possibles;
            }
    },
    {
        pieceClass: 'piece',
        pieceCount: 12,
        placementRule: function (cell) {
            if (cell.getColor() == 'black') {
                return true;
            }
            else {
                return false;
            }
        },
        movementRules: function(x,y){
            var vectors= [
                -[1,-1],
                -[1, 1]
            ];
            var possibles=[];
            for(var i=0; i<vectors.length;i++){
                for(var j=1;j<=vectors[i][2];j++){
                    var possible_coord = {
                        x:x+(vectors[i][0]*j),
                        y:y+(vectors[i][1]*j)
                    };
                    possibles.push(possible_coord);
                }
            }
            return possibles;
        }
    }
];

var game;
$(document).ready(function(){
    game = new gameController('#board');
    game.createBoard(8,8);
    game.initializePlayer(['yellow','blue']);
    game.createPiece(pieceData);

});