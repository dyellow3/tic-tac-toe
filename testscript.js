const gameBoard = (() => {
    let mainBoard = ['', '', '', '', '', '', '', '', ''];

    const check = (board, index) => {
        if (board[index] === '') {
            return true;
        }
        return false;
    }

    const take = (index, symbol) => {
        board[index] = symbol;
    }

    const checkTie = () => {
        //assumings its a tie
        let flag = true;
        for (let i = 0; i < 9; i++) {
            //if theres a empty spot, then its not a tie
            if (gameBoard.check(mainBoard, i)) {
                flag = false;
            }
        }
        return flag;
    }

    const checkWin = (symbol) => {
        const winningCombos = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];

        return winningCombos.some(combo => combo.every(index => board[index] === symbol));
    }

    const getBoard = () => [...mainBoard];

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    }

    return { check, take, checkTie, checkWin, getBoard, resetBoard }

})();

const miniMax = ((board, isMaximizing, symbol) => {
    let computerSymbol;
    let playerSymbol;
    let currSymbol;
    if (isMaximizing) {
        computerSymbol = symbol;
        currSymbol = computerSymbol;
        if (symbol === 'x') {
            playerSymbol = 'o';
        }
        else {
            playerSymbol = 'x';
        }
    }
    else {
        playerSymbol = symbol;
        currSymbol = playerSymbol;
        if (symbol === 'x') {
            computerSymbol = 'o';
        }
        else {
            computerSymbol = 'x';
        }
    }

    if (board.checkWin(currSymbol)) {
        if (currSymbol === playerSymbol) {
            //its players turn
            return -1;
        }
        else if (board.checkTie()) {
            //its a tie 
            return 0;
        }
        else {
            //its computers turn
            return 1;
        }
    }

    //calculate available moves
    let available = [];
    let value;
    let newValue;
    let bestIndex;
    for (let i = 0; i <= 8; i++) {
        if (board.check(board, i)) {
            available.push(i);
        }
    }

    //game is not over yet
    //this will be computers turn

    let newBoard = board;
    if (isMaximizing) {
        value = -Infinity;
        for (let i = 0; i < available.length; i++) {
            newBoard.take(i);
            newValue = miniMax(newBoard, false, playerSymbol);
            if (newValue > value) {
                value = newValue;
                bestIndex = i;
            }
        }
        //value is the best/largest value we can get
        return bestIndex;
    }

    //if its min players turn, need to make vaue of the game as SMALL as possible
    else {
        value = Infinity;
        for (let i = 0; i < available.length; i++) {
            newBoard.take(i);
            newValue = miniMax(newBoard, true, computerSymbol);
            if (newValue > value) {
                value = newValue;
            }
        }
        //value is the best/largest value we can get
        return value;
    }

});

const player = (name, symbol) => {
    const id = 'player';
    const move = (box) => {
        let boxIndex = parseInt(box.classList[1]);
        console.log(boxIndex);
        if (gameBoard.check(gameBoard.getBoard(), boxIndex)) {
            gameBoard.take(boxIndex, symbol);
            box.innerText = `${symbol}`;
            console.log(`${name} takes index ${boxIndex}`);
            return true;
        }
    }

    return { id, name, symbol, move }
}

const computer = (difficulty, symbol) => {
    const name = 'Computer';
    const id = 'computer';


    const move = () => {
        if (difficulty === 'easy') {
            let randomMove = Math.floor(Math.random() * 9);
            while (!gameBoard.check(gameBoard.getBoard(), randomMove)) {
                console.log('asdasdasd');
                randomMove = Math.floor(Math.random() * 9);
            }

            gameBoard.take(randomMove, symbol);
            const box = document.querySelector(`.gameBoard .box:nth-child(${randomMove + 1})`);
            box.innerText = symbol;
            console.log(`Computer takes index ${randomMove}`);
        }
        //minimax
        else if (difficulty === 'hard') {
            //need to store available indexs
            let newBoard = gameBoard;
            let bestScore = -Infinity;
            let bestMove = miniMax(gameBoard, true, symbol);
            gameBoard.take(bestMove);

            //terminal function that tells us, we have checkWin in gameBoard for this

            //need to know if max or min turn?

            //need a function that can tell us each of the possible actions are available to the computer
            //this function will take the game state, and return each possible index possible

            //need a result, which takes a state and a action and tells us new state of game after taking that action.
            //so another gameBoard copy?



            //for efficiency
            //can use alpha-beta pruning to make it more efficient, eliminate parts of game tree we know that wont matter
            //can use depth , limit ourselves to a depth (not optimal?)
        }
        else {
            console.log('Error!');
        }
    }

    return { id, name, symbol, move }
}



const play = (() => {
    const boxes = document.querySelectorAll('.box');
    const gameResult = document.querySelector('.gameResult');
    let round = 0;
    const player1 = player('test', 'X');
    //computer only for now
    const computer1 = computer('easy', 'O');
    let isComputerTurn = false;

    const endGame = (player, round) => {
        if (round === 9) {
            console.log('Draw!')
            gameResult.innerText = 'Draw!';
        }
        else {
            console.log(`${player.name} wins on round ${round}!`);
            gameResult.innerText = `${player.name} wins!`;
        }
        //gameStatus = false;
        boxes.forEach(box => {
            box.removeEventListener('click', playRound);
        })
    }

    const resetGame = () => {
        gameBoard.resetBoard();
        round = 0;
        boxes.forEach(box => {
            box.innerText = '';
        })
        gameResult.innerText = '';
        boxes.forEach(box => {
            box.addEventListener('click', playRound);
        });
    }

    const playRound = (event) => {
        if (!isComputerTurn) {
            const box = event.target;
            let currentPlayer = round % 2 === 0 ? player1 : computer1;

            if (currentPlayer.id === 'player') {
                if (currentPlayer.move(box)) {
                    if ((gameBoard.checkWin(currentPlayer.symbol)) || round === 8) {
                        endGame(currentPlayer, round);
                    }
                    else {
                        round++;
                        console.log(`Round: ${round} over`);
                    }
                }
            }

            // if its not a player, then its a computer
            // so we should run computers move ~2 seconds after players
            if (round % 2 != 0) {
                currentPlayer = round % 2 === 0 ? player1 : computer1;
                isComputerTurn = true;
                setTimeout(() => {
                    currentPlayer.move();
                    if (gameBoard.checkWin(currentPlayer.symbol) || round === 8) {
                        endGame(currentPlayer, round);
                    }
                    else {
                        round++;
                        console.log(`Round: ${round} over`);
                    }

                    isComputerTurn = false;
                }, 2000);
            }
        }


    }

    resetGame();
    const resetButton = document.querySelector('.reset');
    resetButton.addEventListener('click', resetGame);



    boxes.forEach(box => {
        box.addEventListener('click', playRound);
    })
})();