const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const check = (index, symbol) => {
        if(board[index] === '') {
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
        board = ['', '', '', '', '', '', '', '', ''];
    }

    return { check, checkWin, getBoard, resetBoard };
})();


const player = (name, symbol) => {
    const move = (index, box) => {
        box.innerText = `${symbol}`;
        console.log(`${name} takes index ${index}`);
    }
    return { name, symbol, move };
}

const computer = (difficulty, symbol) => {
    const name = 'Computer';

    const move = (board) => {
        if (difficulty === 'easy') {
            let randomMove = Math.floor(Math.random() * 9);
            while (!board.check(randomMove, symbol)) {
                randomMove = Math.floor(Math.random() * 9);
            }

            console.log(`Computer takes index ${randomMove}`);

            //revise
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

    return { name, symbol, move }
}


const play = (() => {
    const boxes = document.querySelectorAll('.box');
    const gameResult = document.querySelector('.gameResult');
    let round = 0;
    const board = gameBoard;
    let gameStatus = true;
    const player1 = player('testname', 'X');
    
    //player2 is computer for now, for testing
    const player2 = computer('easy', 'O');

    const endGame = (player, round) => {
        if (round === 9) {
            console.log('Draw!')
            gameResult.innerText = 'Draw!';
        }
        else {
            console.log(`${player.getName} wins on round ${round}!`);
            gameResult.innerText = `${player.name} wins!`;
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
        gameResult.innerText = '';
        round = 0;
        gameStatus = true;
        boxes.forEach(box => {
            box.addEventListener('click', makeMove);
        });
    }

    const makeMove = (event) => {
        const box = event.target;
        const boxIndex = parseInt(box.classList[1]);
        let currentPlayer = round % 2 === 0 ? player1 : player2;


        if (board.check(boxIndex, currentPlayer.symbol)) {
            currentPlayer.move(boxIndex, box);

            if (board.checkWin(currentPlayer.symbol)) {
                endGame(currentPlayer, round);
            }
            else {
                round++;
                currentPlayer = round % 2 === 0 ? player1 : player2;
                console.log(`Round: ${round} over`);
                if (round === 9) {
                    endGame(currentPlayer, round);
                }
            }

            //computer move for now, need to adjust for when its player v player
            //ideally check if its computer, or player, and go from there
            if (gameStatus) {
                currentPlayer.move(board);
                if (gameBoard.checkWin(currentPlayer.symbol)) {
                    endGame(currentPlayer, round);
                }
                else {
                    round++;
                    console.log(`Round: ${round} over`);
                    if (round === 9) {
                        endGame(currentPlayer, round);
                    }
                }
            }

        }
    }

    const resetButton = document.querySelector('.reset');
    resetButton.addEventListener('click', resetGame);

    resetGame();
    boxes.forEach(box => {
        box.addEventListener('click', makeMove);
    })
})();