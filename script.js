/**
 * Created by Lalim on 3/23/16.
 */

var gameController = function(element){
    var self = this;
    this.element = $(element);
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
        //console.log(cellPosition);
    };

    this.getCellByPosition = function (){
        var pCell = cellPosition[i];
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
                        newPiece = new pieceGenerator(pieceData[p].movementRules);
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background', this.playerOne.getColor());
                        newPiece.addCell(cells[i]);
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        cells[i].setCurrentPiece(newPiece);
                    }
                    //console.log(result);
                }
            }else if (p == 1){
                for (i = 63; i>0 && pieceData[p].pieceCount > 0; i--){
                    result = pieceData[p].placementRule(cells[i]);
                    if (result){
                        pieceData[p].pieceCount--;
                        newPiece = new pieceGenerator(pieceData[p].movementRules);
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background',this.playerTwo.getColor());
                        newPiece.addCell(cells[i]);
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        cells[i].setCurrentPiece(newPiece);
                    }
                    //console.log(result);
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
        };
        this.highlightNeighbors = function(){
            console.log("My move rule: ", this.currentPiece.moveRule(self.position.x,self.position.y));
            var x = this.currentPiece.moveRule(self.position.x,self.position.y);
            console.log(x);
        };


    };

    var pieceGenerator = function(moveRule){
        var self = this;
        this.pieceElement = null;
        this.moveRule = moveRule;
        this.cellElement=null;
        this.addCell= function(the_cell){
            this.cellElement=the_cell;
        };
        this.renderPiece = function (){
            self.pieceElement = $('<div>').addClass('piece');
            self.pieceElement.click(function(){
                self.clickHandler(this);
            });
            return self.pieceElement;
        };
        this.clickHandler = function(pieceElement){
            console.log('I was clicked', pieceElement);
            this.cellElement.highlightNeighbors();
        }


    };

    var playerGenerator = function (color) {
        this.color = color;
        this.getColor = function () {
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
            var totalPossible=[];
            var validPossible=[];
            for(var i=0; i<vectors.length;i++){
                for(var j=1;j<vectors[i].length;j++){
                    var possible_coord = {
                        x:x+(vectors[i][0]*j),
                        y:y+(vectors[i][1]*j)
                    };
                    totalPossible.push(possible_coord);
                    if (totalPossible[i].x < 8 && totalPossible[i].x >= 0 && totalPossible[i].y < 8 && totalPossible[i].y >=0){
                        validPossible.push(totalPossible[i]);
                    }

                }
            }
            return validPossible;
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
                [-1,1],
                [-1, -1]
            ];
            var totalPossible=[];
            var validPossible=[];
            for(var i=0; i<vectors.length;i++){
                for(var j=1;j<vectors[i].length;j++){
                    var possible_coord = {
                        x:x+(vectors[i][0]*j),
                        y:y+(vectors[i][1]*j)
                    };
                    totalPossible.push(possible_coord);
                    if (totalPossible[i].x < 8 && totalPossible[i].x >= 0 && totalPossible[i].y < 8 && totalPossible[i].y >=0){
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
    game.initializePlayer(['yellow','blue']);
    game.createPiece(pieceData);

});