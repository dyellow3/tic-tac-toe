const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const move = (index, symbol) => {
        if (board[index] === '') {
            board[index] = symbol;
            return true;
        }
        return false;
    }

    const checkWin = (symbol) => {
        const winningCombos = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];

        return winningCombos.some(combo => combo.every(index => board[index] === symbol));
    }

    const getBoard = () => [...board];

    const resetBoard = () => {
        for (i = 0; i < 9; i++) {
            board[i] = '';
        }
    }

    return { move, checkWin, getBoard, resetBoard };
})();


const player = (name, symbol) => {
    const getName = name;
    const getSymbol = symbol;
    return { getName, getSymbol };
}

const computer = (difficulty, symbol) => {
    const getDifficulty = difficulty;
    const getSymbol = symbol;
    const getName = 'Computer'
    const move = (board) => {
        if (difficulty === 'easy') {
            let randomMove = Math.floor(Math.random() * 9);
            while (!board.move(randomMove, symbol)) {
                randomMove = Math.floor(Math.random() * 9);
            }
            console.log(`Computer takes index ${randomMove}`);
            const box = document.querySelector(`.gameBoard .box:nth-child(${randomMove + 1})`);
            box.innerText = symbol;
        }
        else if (difficulty === 'impossible') {
            console.log('Error!')
        }
        else {
            console.log('Error!')
        }
    }

    return { getDifficulty, getSymbol, getName, move }
}


const play = (() => {
    const boxes = document.querySelectorAll('.box');
    const gameResult = document.querySelector('.gameResult');
    let round = 0;
    const board = gameBoard;
    const gameStatus = true;
    const player1 = player('testname', 'X');
    const computer1 = computer('easy', 'O');

    const endGame = (player, round) => {
        if (round === 9) {
            console.log('Draw!')
            gameResult.innerText = 'Draw!';
        }
        else {
            console.log(`${player.getName} wins on round ${round}!`);
            gameResult.innerText = `${player.getName} wins!`;
        }
        gameStatus = false;
        boxes.forEach(box => {
            box.removeEventListener('click', makeMove);
        })
    }

    const resetGame = () => {
        board.resetBoard();
        boxes.forEach(box => {
            box.innerText = '';
        })
    }

    const makeMove = (event) => {
        const box = event.target;
        const boxIndex = parseInt(box.classList[1]);


        if (gameBoard.move(boxIndex, player1.getSymbol)) {
            //player move
            box.innerText = `${player1.getSymbol}`;
            console.log(`${player1.getName} takes index ${boxIndex}`);
            if (gameBoard.checkWin(player1.getSymbol)) {
                endGame(player1, round);
            }
            else {
                round++;
                console.log(round);
                if (round === 9) {
                    endGame(player1, round);
                }
            }

            //computer move
            if (gameStatus) {
                computer1.move(gameBoard);
                if (gameBoard.checkWin(computer1.getSymbol)) {
                    endGame(computer1, round);
                }
                else {
                    round++;
                    console.log(round);
                    if (round === 9) {
                        endGame(computer1, round);
                    }
                }
            }

        }



    }
    /*
    const makeMove = (event) => {
        const box = event.target;
        const boxIndex = parseInt(box.classList[1]);
        const currentPlayer = round % 2 === 0 ? player : computer;

        if (gameBoard.move(boxIndex, currentPlayer.getSymbol)) {
            box.innerText = `${currentPlayer.getSymbol}`;
            console.log(`${currentPlayer.getName} box with index: ${boxIndex}`);
            if (gameBoard.checkWin(currentPlayer.getSymbol)) {
                endGame(currentPlayer, round);
            }
            else {
                round++;
                console.log(round);
                if (round === 9) {
                    endGame(currentPlayer, round);
                }
            }
        }
    }
    */



    resetGame();
    boxes.forEach(box => {
        box.addEventListener('click', makeMove);
    })
})();