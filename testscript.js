//TODO
//Find a cleaner way to get mainBoard / find a cleaner way to implement gameBoard functions
//Add option to play against another player

const gameBoard = (() => {
    let mainBoard = ['', '', '', '', '', '', '', '', ''];

    const check = (board, index) => {
        if (board[index] === '') {
            return true;
        }
        return false;
    }

    const take = (board, index, symbol) => {
        board[index] = symbol;
    }

    const checkTie = (board) => {
        //assumings its a tie
        let flag = true;
        //if theres a win, then its not a tie
        if (gameBoard.checkWin(board, 'X') || gameBoard.checkWin(board, 'O')) { return false; }
        for (let i = 0; i < 9; i++) {
            //if theres a empty spot, then its not a tie
            if (gameBoard.check(board, i)) {
                flag = false;
            }
        }
        return flag;
    }

    const checkWin = (board, symbol) => {
        const winningCombos = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];

        return winningCombos.some(combo => combo.every(index => board[index] === symbol));
    }

    const getBoard = () => mainBoard;

    const resetBoard = () => {
        mainBoard = ['', '', '', '', '', '', '', '', ''];
    }

    return { check, take, checkTie, checkWin, getBoard, resetBoard }

})();

//depth can be used for optimizations, !!not used for now!!
const miniMax = ((board, isMaximizing, symbol, depth) => {
    let computerSymbol;
    let playerSymbol;
    if (isMaximizing) {
        computerSymbol = symbol;
        if (symbol === 'X') {
            playerSymbol = 'O';
        }
        else {
            playerSymbol = 'X';
        }
    }
    else {
        playerSymbol = symbol;
        if (symbol === 'X') {
            computerSymbol = 'O';
        }
        else {
            computerSymbol = 'X';
        }
    }

    //so if we are maximizing, it is the computers turn. Therefore, if there is a win, the player made the last move, and they have won
    if (gameBoard.checkTie(board)) { return 0; }
    if (isMaximizing && gameBoard.checkWin(board, playerSymbol)) { return -1; }
    if (!isMaximizing && gameBoard.checkWin(board, computerSymbol)) { return 1; }


    //calculate available moves
    let available = [];
    for (let i = 0; i <= 8; i++) {
        if (gameBoard.check(board, i)) {
            available.push(i);
        }
    }

    //variables needed for next steps
    let newBoard;
    let value;
    let newValue;

    //if we are maximizing (computers turn), we need to make value as LARGE as possible
    if (isMaximizing) {
        value = -10;
        for (let i = 0; i < available.length; i++) {
            //we assign newBoard to existing board so it resets every time
            newBoard = [...board];
            gameBoard.take(newBoard, available[i], computerSymbol);
            //testing value of move on this newBoard
            newValue = miniMax(newBoard, false, playerSymbol, depth + 1);
            if (newValue > value) {
                value = newValue;

            }
        }
        //value is the largest value (best value for computer)
        return value;
    }

    //if we are minimizing (players turn), we to make value as SMALL as possible
    else {
        value = 10;
        for (let i = 0; i < available.length; i++) {
            newBoard = [...board];
            gameBoard.take(newBoard, available[i], playerSymbol);

            newValue = miniMax(newBoard, true, computerSymbol, depth + 1);
            if (newValue < value) {
                value = newValue;
            }
        }
        //value is the smallest value (best value for player/opponent)
        return value;
    }
});

const findBestIndex = ((board, symbol) => {
    //find available moves
    let available = [];
    for (let i = 0; i <= 8; i++) {
        if (gameBoard.check(board, i)) {
            available.push(i);
        }
    }

    //variables needed for next steps
    let newBoard;
    let playerSymbol;
    let bestVal = -10;
    let bestIndex = -1;

    //we are testing each available move
    for (let i = 0; i < available.length; i++) {
        //newBoard resets everytime to fresh board that we can test moves on
        newBoard = [...board];

        //assuming that the symbol in the input is the computers symbol
        if (symbol === 'X') { playerSymbol = 'O'; }
        else { playerSymbol = 'X'; }

        //testing available move on new board
        gameBoard.take(newBoard, available[i], symbol);
        let moveVal = miniMax(newBoard, false, playerSymbol, 0);
        if (moveVal > bestVal) {
            bestIndex = available[i];
            bestVal = moveVal;
        }
    }
    return bestIndex;
})

const player = (name, symbol) => {
    const id = 'player';
    const move = (box) => {
        let boxIndex = parseInt(box.classList[1]);
        console.log(boxIndex);
        if (gameBoard.check(gameBoard.getBoard(), boxIndex)) {
            gameBoard.take(gameBoard.getBoard(), boxIndex, symbol);
            box.innerText = `${symbol}`;
            console.log(`${name} takes index ${boxIndex}`);
            return true;
        }
    }

    return { id, name, symbol, move }
}

const computer = (diff, symbol) => {
    const name = 'Computer';
    const id = 'computer';
    let difficulty = diff;

    const toggleDifficulty = () => {
        if(difficulty==='Easy') { difficulty = 'Hard'; }
        else { difficulty = 'Easy'; }
    }

    const move = () => {

        if (difficulty === 'Easy') {
            let randomMove = Math.floor(Math.random() * 9);
            while (!gameBoard.check(gameBoard.getBoard(), randomMove)) {
                randomMove = Math.floor(Math.random() * 9);
            }

            gameBoard.take(gameBoard.getBoard(), randomMove, symbol);
            const box = document.querySelector(`.gameBoard .box:nth-child(${randomMove + 1})`);
            box.innerText = symbol;
            console.log(`Computer takes index ${randomMove}`);
        }

        //minimax algorithm
        else if (difficulty === 'Hard') {
            let bestIndex = findBestIndex(gameBoard.getBoard(), symbol);
            gameBoard.take(gameBoard.getBoard(), bestIndex, symbol);
            const box = document.querySelector(`.gameBoard .box:nth-child(${bestIndex + 1})`);
            box.innerText = symbol;
            console.log(`Computer takes index ${bestIndex}`);
        }

        else {
            console.log('Error!');
        }
    }

    return { id, name, difficulty, symbol, toggleDifficulty, move }
}



const play = (() => {
    const checkBox = document.getElementById('diffSelect');
    const switchElement = document.querySelector('.diff-switch');
    const isChecked = checkBox.checked;
    const difficulty = isChecked ? switchElement.getAttribute('data-checked') : switchElement.getAttribute('data-unchecked');
    console.log('Difficulty:', difficulty);


    const boxes = document.querySelectorAll('.box');
    const gameResult = document.querySelector('.gameResult');
    let round = 0;
    const player1 = player('test', 'X');
    //computer only for now
    const computer1 = computer(`${difficulty}`, 'O');
    checkBox.addEventListener('change', function (event) {
        if(round !== 0) {
            event.preventDefault();
            event.stopPropagation();

        }
        else {
            const isChecked = checkBox.checked;
            const difficulty = isChecked ? switchElement.getAttribute('data-checked') : switchElement.getAttribute('data-unchecked'); 
            console.log('Difficulty:', difficulty);
            computer1.toggleDifficulty();
        }
        
    });
    let currentPlayer = round % 2 === 0 ? player1 : computer1;
    let isComputerTurn = false;

    const endGame = (player, round) => {
        if (round === 8) {
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

            if (currentPlayer.id === 'player') {
                if (currentPlayer.move(box)) {
                    if ((gameBoard.checkWin(gameBoard.getBoard(), currentPlayer.symbol)) || round === 8) {
                        endGame(currentPlayer, round);
                    }

                    else {
                        round++;
                        console.log(`Round: ${round} over`);
                    }
                    currentPlayer = round % 2 === 0 ? player1 : computer1;
                }
            }

            // if the current player is now a computer, we will run its move now
            // so we should run computers move ~2 seconds after players
            if (currentPlayer.id === 'computer') {
                isComputerTurn = true;
                setTimeout(() => {
                    currentPlayer.move();
                    if (gameBoard.checkWin(gameBoard.getBoard(), currentPlayer.symbol) || round === 8) {
                        endGame(currentPlayer, round);
                    }
                    else {
                        round++;
                        console.log(`Round: ${round} over`);
                    }

                    isComputerTurn = false;
                    currentPlayer = round % 2 === 0 ? player1 : computer1;
                }, 2000);
            }
        }


    }

    resetGame;
    const resetButton = document.querySelector('.reset');
    resetButton.addEventListener('click', resetGame);



    boxes.forEach(box => {
        box.addEventListener('click', playRound);
    })
})();