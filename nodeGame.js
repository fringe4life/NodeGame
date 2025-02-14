"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prompt_sync_plus_1 = require("prompt-sync-plus");
var config = {};
var prompt = (0, prompt_sync_plus_1.default)(undefined);
var fieldElements = ["^", "O", "░", "*"];
var Field = /** @class */ (function () {
    function Field(array2d) {
        this.field = array2d;
        this.currentPosition = {
            first: 0,
            second: 0
        };
    }
    Field.prototype.print = function () {
        for (var _i = 0, _a = this.field; _i < _a.length; _i++) {
            var row = _a[_i];
            process.stdout.write(row.join(""));
        }
    };
    Field.prototype.checkField = function (position) {
        var _this = this;
        return fieldElements.map(function (field) { return _this.field[position.first][position.second] === field; });
    };
    Field.prototype.getNewPosition = function (first, second) {
        var newPosition = {
            first: first,
            second: second
        };
        return newPosition;
    };
    Field.prototype.isNewPositionInBoard = function (position) {
        return this.field.length > position.first && position.first >= 0 && this.field[0].length > position.second && position.second >= 0;
    };
    Field.prototype.checkLegalMove = function (input) {
        var _a = this.currentPosition, first = _a.first, second = _a.second;
        var position;
        switch (input) {
            case 'd':
                position = this.getNewPosition(first + 1, second);
                break;
            case 'l':
                position = this.getNewPosition(first, second - 1);
                break;
            case 'r':
                position = this.getNewPosition(first, second + 1);
                break;
            case 'u':
                position = this.getNewPosition(first - 1, second);
                break;
            default:
                console.log('that is not a correct move\nCorrect moves are l, d, u or r');
                return true;
        }
        // needed in case movement is legal
        // result is not in array
        if (!this.isNewPositionInBoard(position)) {
            console.log("Area out of bounds");
            return true;
        }
        // destructure array to improve readability
        var _b = this.checkField(position), win = _b[0], lose = _b[1];
        if (win) {
            // you win
            console.log("You win by reaching the hat!! congratulations");
            return true;
        }
        if (lose) {
            // you fell down a hole
            console.log("You fell down a whole");
            return true;
        }
        // else a legal move
        // update the Fields currentPosition
        this.currentPosition = position;
        return false;
    };
    Field.prototype.moveCharacter = function () {
        this.field[this.currentPosition.first][this.currentPosition.second] = fieldElements[3];
    };
    Field.generateRandomFieldItem = function (percentage) {
        if (percentage === void 0) { percentage = 0.1; }
        var randomNumber = Math.random();
        if (randomNumber >= 0 && randomNumber < percentage) {
            return fieldElements[1];
        }
        return fieldElements[2];
    };
    Field.placeHatOnField = function (fieldArray, height, width) {
        var h = 0;
        var w = 0;
        do {
            h = Math.floor(Math.random() * height);
            w = Math.floor(Math.random() * width);
        } while (!h || !w);
        fieldArray[h][w] = fieldElements[0];
    };
    Field.generateField = function (height, width, percentage) {
        var actualPercentage = percentage / 100;
        var fieldArray = [];
        for (var i = 0; i < height; i++) {
            var newArray = [];
            for (var j = 0; j < width; j++) {
                newArray.push(Field.generateRandomFieldItem(actualPercentage));
            }
            fieldArray.push(newArray);
        }
        Field.placeHatOnField(fieldArray, height, width);
        fieldArray[0][0] = fieldElements[3];
        return fieldArray;
    };
    return Field;
}());
var fieldArray = Field.generateField(4, 5, 33);
var field = new Field(fieldArray);
var result = false;
do {
    field.print();
    var input = prompt("Where would you like to move?");
    result = field.checkLegalMove(input);
    field.moveCharacter();
} while (!result);
