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

    const resetBoard = (board) => {
        board = ['', '', '', '', '', '', '', '', ''];
    }

    return { check, take, checkTie, checkWin, getBoard, resetBoard }

})();

const miniMax = ((board, isMaximizing, symbol, depth) => {
    let computerSymbol;
    let playerSymbol;
    let currSymbol;
    if (isMaximizing) {
        computerSymbol = symbol;
        currSymbol = computerSymbol;
        if (symbol === 'X') {
            playerSymbol = 'O';
        }
        else {
            playerSymbol = 'X';
        }
    }
    else {
        playerSymbol = symbol;
        currSymbol = playerSymbol;
        if (symbol === 'X') {
            computerSymbol = 'O';
        }
        else {
            computerSymbol = 'X';
        }
    }

    //so if we are maximizing, it is the computers turn. Therefore, if there is a win, the player made the last move, and they have won
    if(gameBoard.checkTie(board)) { return 0; }
    if(isMaximizing && gameBoard.checkWin(board, playerSymbol)) { return -1;  }
    if(!isMaximizing && gameBoard.checkWin(board, computerSymbol)) {  return 1;  }
    

    //calculate available moves
    let available = [];
    let value;
    let newValue;
    for (let i = 0; i <= 8; i++) {
        if (gameBoard.check(board, i)) {
            available.push(i);
        }
    }

    //game is not over yet
    //this will be computers turn

    let newBoard; 
    if (isMaximizing) {
        value = -Infinity;
        for (let i = 0; i < available.length; i++) {
            newBoard = [...board];
            gameBoard.take(newBoard, available[i], computerSymbol);
            newValue = miniMax(newBoard, false, playerSymbol, depth+1);
            if (newValue > value) {
                value = newValue;
            }
        }
        //value is the best/largest value we can get
        return value;
    }

    //if its min players turn, need to make vaue of the game as SMALL as possible
    else {
        value = Infinity;
        for (let i = 0; i < available.length; i++) {
            console.log()
            newBoard = [...board];
            gameBoard.take(newBoard, available[i], playerSymbol);
            newValue = miniMax(newBoard, true, computerSymbol, depth+1);
            if (newValue < value) {
                value = newValue;
            }
        }
        //value is the best/largest value we can get
        return value;
    }

});

const findBestIndex = ((board, symbol) => {
    let available = [];
    let bestVal = -1000;
    let bestIndex = -1;
    for (let i = 0; i <= 8; i++) {
        if (gameBoard.check(board, i)) {
            available.push(i);
        }
    }

    let newBoard;
    let playerSymbol;
    for(let i = 0; i < available.length; i++) {
        
        newBoard = [...board];
        console.log(`board: ${newBoard}`);
        if(symbol === 'X') {  playerSymbol = 'O'; }
        else { playerSymbol = 'X'; }
        gameBoard.take(newBoard, available[i], symbol);
        console.log(`Testing UPDATED board: ${newBoard}`);
        let moveVal = miniMax(newBoard, false, playerSymbol, 0);
        if(moveVal > bestVal) {
            console.log(`New best moveValue assigned ${moveVal}`);
            console.log(`New best index assigned ${bestIndex}`);
            bestIndex = available[i];
            bestVal = moveVal;
        }
    }
    console.log(bestIndex);
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

const computer = (difficulty, symbol) => {
    const name = 'Computer';
    const id = 'computer';


    const move = () => {
        if (difficulty === 'easy') {
            let randomMove = Math.floor(Math.random() * 9);
            while (!gameBoard.check(gameBoard.getBoard(), randomMove)) {
                randomMove = Math.floor(Math.random() * 9);
            }

            gameBoard.take(gameBoard.getBoard(), randomMove, symbol);
            const box = document.querySelector(`.gameBoard .box:nth-child(${randomMove + 1})`);
            box.innerText = symbol;
            console.log(`Computer takes index ${randomMove}`);
        }
        //minimax
        else if (difficulty === 'hard') {
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

    return { id, name, symbol, move }
}



const play = (() => {
    const boxes = document.querySelectorAll('.box');
    const gameResult = document.querySelector('.gameResult');
    let round = 0;
    const player1 = player('test', 'X');
    //computer only for now
    const computer1 = computer('hard', 'O');
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
        gameBoard.resetBoard(gameBoard.getBoard());
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
                    if ((gameBoard.checkWin(gameBoard.getBoard(), currentPlayer.symbol)) || round === 8) {
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
                    if (gameBoard.checkWin(gameBoard.getBoard(), currentPlayer.symbol) || round === 8) {
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