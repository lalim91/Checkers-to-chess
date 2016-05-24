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
                colorIndex = 1 - colorIndex;
            }
        self.element.append(tr);
        colorIndex = 1 - colorIndex;
        }
    }

    var cellGenerator = function(color, position){
        var cellSelf = this;
        cellSelf.color = color;
        cellSelf.position = position;
        cellSelf.cellElement = $('<td>')
        )

    }


};
var game;
$(document).ready(function(){
   game = new gameController('#game');
});