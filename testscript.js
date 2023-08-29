const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const check = (index) => {
        if (board[index] === '') {
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

    return { check, checkWin, getBoard, resetBoard }

})();

const player = (name, symbol) => {
    const id = 'player';
    const move = (box) => {
        let boxIndex = parseInt(box.classList[1]);
        console.log(boxIndex);
        if (gameBoard.check(boxIndex)) {
            gameBoard.getBoard()[boxIndex] = symbol;
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
            while (!gameBoard.check(randomMove)) {
                randomMove = Math.floor(Math.random() * 9);
            }

            gameBoard.getBoard()[randomMove] = symbol;
            const box = document.querySelector(`.gameBoard .box:nth-child(${randomMove + 1})`);
            box.innerText = symbol;
            console.log(`Computer takes index ${randomMove}`);
        }
        else if (difficulty === 'impossible') {
            console.log('Error!')
        }
        else {
            console.log('Error!')
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

    const endGame = (player, round) => {
        if (round === 9) {
            console.log('Draw!')
            gameResult.innerText = 'Draw!';
        }
        else {
            console.log(`${player.getName} wins on round ${round}!`);
            gameResult.innerText = `${player.name} wins!`;
        }
        //gameStatus = false;
        boxes.forEach(box => {
            box.removeEventListener('click', playRound);
        })
    }

    const resetGame = () => {
        gameBoard.resetBoard();
        boxes.forEach(box => {
            box.innerText = '';
        })
        gameResult.innerText = '';
        boxes.forEach(box => {
            box.addEventListener('click', playRound);
        });
    }

    const playRound = (event) => {
        const box = event.target;
        let currentPlayer = round % 2 === 0 ? player1 : computer1;

        if (currentPlayer.id === 'player') {
            if (currentPlayer.move(box)) {
                if (gameBoard.checkWin(currentPlayer.symbol || round === 8)) {
                    endGame(currentPlayer, round);
                }
                else {
                    round++;
                    console.log(`Round: ${round} over`);
                }
            }
        }
        else {
            currentPlayer.move();
            if (gameBoard.checkWin(currentPlayer.symbol || round === 8)) {
                endGame(currentPlayer, round);
            }
            else {
                round++;
                console.log(`Round: ${round} over`);
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