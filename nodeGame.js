const prompt = require('prompt-sync')({sigint: true});

const fieldElemenets = "^O░*".split("")

class Field {
  constructor(array2d){
    this.field = array2d;
    this.currentPosition = {
      first: 0,
      second: 0
    }
    this.acceptableMoves = "ldur".split("")
  }
  print(){
    for( const row of this.field){
      row.forEach((fieldCharacter, i)=>{
        const length = row.length
        process.stdout.write(fieldCharacter)
        if(length - 1 === i){
          process.stdout.write("\n");
        }
      })
    }
		}
  checkField(position){
    return fieldElemenets.map(field=>this.field[position.first][position.second]===field)
  }
  getNewPosition(first, second){
    const newPosition = {
      first:first,
      second:second
    }
    return newPosition
  }
  isNewPositionInBoard(position){
    return this.field.length > position.first && position.first >= 0 && this.field[0].length > position.second && position.second >= 0
  }
  checkLegalMove(input){
    const {first, second} = this.currentPosition
    let position;
    switch(input){
      case 'd':
        position = this.getNewPosition(first +1, second)
        break;
      case 'l':
        position = this.getNewPosition(first , second - 1 )
        break;
      case 'r':
        position = this.getNewPosition(first , second + 1 )
        break
      case 'u':
        position = this.getNewPosition(first - 1, second )
        break;
      default:
        console.log('that is not a correct move\nCorrect moves are l, d, u or r')
        return true
    }
  
    // needed in case movement is legal
    // result is not in array
    if(!this.isNewPositionInBoard(position)){
      console.log("Area out of bounds");
      return true
    }
    // destructure array to improve readability
    const [win, lose] = this.checkField(position)
    if(win){
      // you win
      console.log("You win by reaching the hat!! congratulations")
      return true
    } 
    if(lose){
      // you fell down a hole
      console.log("You fell down a whole")
      return true
    } 
    // else a legal move
    // update the Fields currentPosition
    this.currentPosition = position
    return false
  }
  moveCharacter(){
    this.field[this.currentPosition.first][this.currentPosition.second] = fieldElemenets[3]
  }
  static generateRandomFieldItem(percentage = 0.1){
    
    const randomNumber = Math.random()
    if( randomNumber >= 0 && randomNumber < percentage){
      return fieldElemenets[1];
    } 
    return fieldElemenets[2]
    
  }
  static placeHatOnField(fieldArray, height, width ){
    let h = 0
    let w = 0
    do {
      h = Math.floor(Math.random() * height)
      w = Math.floor(Math.random() * width)
    } while ( !h || !w)

    fieldArray[h][w] = fieldElemenets[0]
  }
  static generateField(height, width, percentage){
    const actualPercentage = percentage / 100
    const fieldArray = new Array()
    for (let i= 0;i< height;i++){
      const newArray = []
      for (let j=0;j<width;j++){
        newArray.push(Field.generateRandomFieldItem(actualPercentage))
      }
      fieldArray.push(newArray)
    }
    Field.placeHatOnField(fieldArray, height, width)
    fieldArray[0][0] = fieldElemenets[3]
    return fieldArray;
  }
}

const fieldArray = Field.generateField(4, 5, 33)

const field = new Field(fieldArray)
let result = false
do {
  field.print();

  const input  = prompt("Where would you like to move?");
  result = field.checkLegalMove(input)

  field.moveCharacter()

} while( !result)
