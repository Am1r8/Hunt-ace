const cardObjectDefinitions = [
    { id: 1, imagePath: '/images/card-KingHearts.png' },
    { id: 2, imagePath: '/images/card-JackClubs.png' },
    { id: 3, imagePath: '/images/card-QueenDiamonds.png' },
    { id: 4, imagePath: '/images/card-AceSpades.png' }
]
const aceId = 4

const cardBackImgPath = '/images/card-back-blue.png'

let cards = []

const playGameButtonElem = document.getElementById('playGame')

const cardContainerElem = document.querySelector('.card-container')

const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = ".card-pos-a"

const numCards = cardObjectDefinitions.length

let cardPositions = []


let gameInProgress = false
let shufflingInProgress = false
let cardsRevealed = false


const currentGameStatusElem = document.querySelector('.current-status')
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')

const winColor = "green"
const loseColor = "red"
const primaryColor = "black"

let roundNum = 0
let maxRounds = 4
let score = 0

let gameObj = {}

const localStorageGameKey = "HTA"

loadGame()


function gameOver() {
    updateStatusElement(scoreContainerElem, "none")
    updateStatusElement(roundContainerElem, "none")

    const gameOverMessage = `Game Over! Final Score - <span class = 'badge'>${score}</span> Click 'Play Game' button to play again`

    updateStatusElement(currentGameStatusElem, "block", primaryColor, gameOverMessage)

    gameInProgress = false
    playGameButtonElem.disabled = false
}


function endRound() {
    setTimeout(() => {
        if (roundNum == maxRounds) {
            gameOver()
            return
        } else {
            startRound()
        }
    }, 3000)
}


function chooseCard(card) {
    if (canChooseCard()) {
        evaluateCardChoice(card)
        saveGameObjectToLocalStorage(score, roundNum)
        flipCard(card, false)

        setTimeout(() => {
            flipCards(false)
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Card positions revealed")

            endRound()

        }, 3000)
        cardsRevealed = true
    }

}


function calculateScoreToAdd(roundNum) {
    if (roundNum == 1) {
        return 100
    } else if (roundNum == 2) {
        return 50
    } else if (roundNum == 3) {
        return 25
    } else {
        return 10
    }
}


function calculateScore() {
    const scoreToAdd = calculateScoreToAdd(roundNum)
    score = score + scoreToAdd
}

function updateScore() {
    calculateScore()
    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`)

}

function updateStatusElement(elem, display, color, innerHTML) {
    elem.style.display = display

    if (arguments.length > 2) {
        elem.style.color = color
        elem.innerHTML = innerHTML
    }

}


function outputChoiceFeedBack(hit) {
    if (hit) {
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)")
    } else {
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! :(")
    }
}

function evaluateCardChoice(card) {
    if (card.id == aceId) {
        updateScore()
        outputChoiceFeedBack(true)
    } else {
        outputChoiceFeedBack(false)
    }
}

function canChooseCard() {
    return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}


function loadGame() {
    createCards()

    cards = document.querySelectorAll('.card')

    cardFlyInEffect()

    playGameButtonElem.addEventListener('click', () => startGame())

    updateStatusElement(scoreContainerElem, "none")
    updateStatusElement(roundContainerElem, "none")

}


function checkForIncompleteGame() {
    const serializedGameObj = getLocalStorageItemValue(localStorageGameKey)
    if (serializedGameObj) {
        gameObj = getObjectFromJSON(serializedGameObj)

        if (gameObj.round >= maxRounds) {
            removeLocalStorageItem(localStorageGameKey)
        } else {
            if (confirm('Would you like to continue with your last game?')) {
                score = gameObj.score
                roundNum = gameObj.round
            }
        }

    }

}