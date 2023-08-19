

const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];
    return {board};
})

const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return {getName, getSymbol};
}

const play = (() => {
    const {board} = new gameBoard;
    const player1 = player('testname', 'X');
    const player2 = player('testname2', 'O');

    //move function here?

})

/*
move function (takes player)
    if board[index] === '' then set that index to player.symbol
    proceed to check if this is a winning move, or if the board is full then call draw


checkwin functioin 
    winning indexes are:
    (0,1,2)
    (0,3,6)
    (0,4,8)
    (1,4,7)
    (2,5,8)
    (2,4,6)
    (3,4,5)
    (6,7,8)


 */
