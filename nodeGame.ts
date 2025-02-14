import psp from "prompt-sync-plus";
const prompt = psp(undefined);

const fieldElements = ["^", "O", "░", "*"] as const

type Elements = "^" | "O" | "░" | "*"

type Position = {
  first: number,
  second: number
}
class Field {
  field: Elements[][];
  currentPosition: Position
  constructor(array2d: Elements[][]) {
    this.field = array2d;
    this.currentPosition = {
      first: 0,
      second: 0
    }
  }
  print() {
    for (const row of this.field) {
      process.stdout.write(row.join(""))
      process.stdout.write("\n")
    }
  }
  checkField(position: { first: number, second: number }) {
    return fieldElements.map(field => this.field[position.first][position.second] === field)
  }
  getNewPosition(first: number, second: number) {
    return {
      first: first,
      second: second
    }
  }
  isNewPositionInBoard(position: Position) {
    return this.field.length > position.first && position.first >= 0 && this.field[0].length > position.second && position.second >= 0
  }
  checkLegalMove(input: string) {
    const { first, second } = this.currentPosition
    let position: Position
    switch (input) {
      case 'd':
        position = this.getNewPosition(first + 1, second)
        break;
      case 'l':
        position = this.getNewPosition(first, second - 1)
        break;
      case 'r':
        position = this.getNewPosition(first, second + 1)
        break
      case 'u':
        position = this.getNewPosition(first - 1, second)
        break;
      default:
        console.log('that is not a correct move\nCorrect moves are l, d, u or r')
        return true
    }

    // needed in case movement is legal
    // result is not in array
    if (!this.isNewPositionInBoard(position)) {
      console.log("Area out of bounds");
      return true
    }
    // destructure array to improve readability
    const [win, lose] = this.checkField(position)
    if (win) {
      // you win
      console.log("You win by reaching the hat!! congratulations")
      return true
    }
    if (lose) {
      // you fell down a hole
      console.log("You fell down a whole")
      return true
    }
    // else a legal move
    // update the Fields currentPosition
    this.currentPosition = position
    return false
  }
  moveCharacter() {
    this.field[this.currentPosition.first][this.currentPosition.second] = fieldElements[3]
  }
  static generateRandomFieldItem(percentage = 0.1): typeof fieldElements[number] {

    const randomNumber = Math.random()
    if (randomNumber >= 0 && randomNumber < percentage) {
      return fieldElements[1];
    }
    return fieldElements[2]

  }
  static placeHatOnField(fieldArray: Elements[][], height: number, width: number) {
    let h = 0
    let w = 0
    do {
      h = Math.floor(Math.random() * height)
      w = Math.floor(Math.random() * width)
    } while (!h || !w)

    fieldArray[h][w] = fieldElements[0]
  }
  static generateField(height: number, width: number, percentage: number) {
    const actualPercentage = percentage / 100
    const fieldArray: Elements[][] = []
    for (let i = 0; i < height; i++) {
      const newArray: Elements[] = []
      for (let j = 0; j < width; j++) {
        newArray.push(Field.generateRandomFieldItem(actualPercentage))
      }
      fieldArray.push(newArray)
    }
    Field.placeHatOnField(fieldArray, height, width)
    fieldArray[0][0] = fieldElements[3]
    return fieldArray;
  }
}

const fieldArray: Elements[][] = Field.generateField(4, 5, 33)

const field = new Field(fieldArray)
let result = false
do {
  field.print();

  // TODO: handle case where undefined is response
  const input = prompt("Where would you like to move?") as string;
  result = field.checkLegalMove(input)

  field.moveCharacter()

} while (!result)
