

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

    return { move, checkWin, getBoard };
})();


const player = (name, symbol) => {
    const getName = name;
    const getSymbol = symbol;

    return { getName, getSymbol };
}


const play = (() => {
    let round = 0;
    const board = gameBoard;
    const player1 = player('testname', 'X');
    const player2 = player('testname2', 'O');

    const endGame = (player, round) => {
        if(round === 9) {
            console.log("Draw!")
        }
        else {
            console.log(`${player.getName} wins on round ${round}!`);
        }
        boxes.forEach(box => {
            box.removeEventListener('click', handleClick);
        })
    }

    const handleClick = (event) => {
        const box = event.target;
        const boxIndex = parseInt(box.classList[1]);
        const currentPlayer = round % 2 === 0 ? player1 : player2;

        if (gameBoard.move(boxIndex, currentPlayer.getSymbol)) {
            box.innerText = `${currentPlayer.getSymbol}`;
            console.log(`${currentPlayer.getName} box with index: ${boxIndex}`);
            if (gameBoard.checkWin(currentPlayer.getSymbol)) {
                endGame(currentPlayer, round);
            }
            else {
                round++;
                console.log(round);
                if(round === 9) {
                    endGame(currentPlayer, round);
                }
            }
        }
    }

    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('click', handleClick);
    })
})();

play;
