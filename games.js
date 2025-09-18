// Learning Games System

class GamesManager {
    constructor() {
        this.games = this.initializeGames();
        this.currentGame = null;
    }

    initializeGames() {
        return {
            'math-quiz': {
                title: 'Math Quiz Challenge',
                description: 'Test your arithmetic skills',
                difficulty: 'easy',
                xpReward: 20,
                subject: 'mathematics',
                init: this.initMathQuiz.bind(this),
                cleanup: this.cleanupMathQuiz.bind(this)
            },
            'science-lab': {
                title: 'Virtual Science Lab',
                description: 'Conduct safe experiments',
                difficulty: 'medium',
                xpReward: 25,
                subject: 'science',
                init: this.initScienceLab.bind(this),
                cleanup: this.cleanupScienceLab.bind(this)
            },
            'pattern-game': {
                title: 'Pattern Master',
                description: 'Complete the sequences',
                difficulty: 'hard',
                xpReward: 30,
                subject: 'mathematics',
                init: this.initPatternGame.bind(this),
                cleanup: this.cleanupPatternGame.bind(this)
            }
        };
    }

    playGame(gameId) {
        const game = this.games[gameId];
        if (!game) {
            console.error(`Game ${gameId} not found`);
            return;
        }

        this.currentGame = game;
        const modal = document.getElementById('gameModal');
        const gameArea = document.getElementById('gameArea');
        const gameTitle = document.getElementById('gameTitle');

        gameTitle.textContent = game.title;
        modal.classList.add('active');
        
        // Initialize the specific game
        game.init(gameArea);
        
        // Record that user started playing
        if (typeof progressManager !== 'undefined') {
            progressManager.recordActivity('game_played', {
                subject: game.subject,
                xp: game.xpReward
            });
        }
    }

    closeGame() {
        if (this.currentGame && this.currentGame.cleanup) {
            this.currentGame.cleanup();
        }
        
        const modal = document.getElementById('gameModal');
        const gameArea = document.getElementById('gameArea');
        
        modal.classList.remove('active');
        gameArea.innerHTML = '';
        this.currentGame = null;
    }

    // Math Quiz Game
    initMathQuiz(container) {
        const gameState = {
            score: 0,
            questionCount: 0,
            maxQuestions: 10,
            timeLeft: 60,
            timer: null,
            currentQuestion: null
        };

        const gameHTML = `
            <div class="math-quiz-game">
                <div class="game-header">
                    <div class="score">Score: <span id="mathScore">0</span></div>
                    <div class="timer">Time: <span id="mathTimer">60</span>s</div>
                    <div class="question-counter">
                        Question <span id="mathQuestionNum">1</span> of ${gameState.maxQuestions}
                    </div>
                </div>
                <div class="question-area">
                    <div class="question" id="mathQuestion"></div>
                    <div class="answers" id="mathAnswers"></div>
                </div>
                <div class="feedback" id="mathFeedback"></div>
            </div>
        `;

        container.innerHTML = gameHTML;

        // Start timer
        gameState.timer = setInterval(() => {
            gameState.timeLeft--;
            document.getElementById('mathTimer').textContent = gameState.timeLeft;
            if (gameState.timeLeft <= 0) {
                this.endMathQuiz(gameState);
            }
        }, 1000);

        this.generateMathQuestion(gameState);
    }

    generateMathQuestion(gameState) {
        const operations = ['+', '-', '×', '÷'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, correctAnswer;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                correctAnswer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 50) + 20;
                num2 = Math.floor(Math.random() * num1);
                correctAnswer = num1 - num2;
                break;
            case '×':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                correctAnswer = num1 * num2;
                break;
            case '÷':
                correctAnswer = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                num1 = correctAnswer * num2;
                break;
        }

        gameState.currentQuestion = {
            question: `${num1} ${operation} ${num2} = ?`,
            correctAnswer: correctAnswer
        };

        // Generate wrong answers
        const wrongAnswers = [];
        for (let i = 0; i < 3; i++) {
            let wrongAnswer;
            do {
                wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
            } while (wrongAnswer === correctAnswer || wrongAnswers.includes(wrongAnswer) || wrongAnswer < 0);
            wrongAnswers.push(wrongAnswer);
        }

        // Shuffle answers
        const allAnswers = [correctAnswer, ...wrongAnswers];
        allAnswers.sort(() => Math.random() - 0.5);

        // Display question
        document.getElementById('mathQuestion').textContent = gameState.currentQuestion.question;
        
        const answersContainer = document.getElementById('mathAnswers');
        answersContainer.innerHTML = '';
        
        allAnswers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.className = 'answer-btn';
            button.onclick = () => this.checkMathAnswer(gameState, answer, correctAnswer);
            answersContainer.appendChild(button);
        });
    }

    checkMathAnswer(gameState, selectedAnswer, correctAnswer) {
        const feedback = document.getElementById('mathFeedback');
        const buttons = document.querySelectorAll('.answer-btn');
        
        buttons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            gameState.score += 10;
            feedback.textContent = 'Correct! 🎉';
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = `Wrong! The correct answer was ${correctAnswer}`;
            feedback.className = 'feedback wrong';
        }

        document.getElementById('mathScore').textContent = gameState.score;

        setTimeout(() => {
            gameState.questionCount++;
            if (gameState.questionCount >= gameState.maxQuestions) {
                this.endMathQuiz(gameState);
            } else {
                document.getElementById('mathQuestionNum').textContent = gameState.questionCount + 1;
                this.generateMathQuestion(gameState);
                feedback.textContent = '';
                feedback.className = 'feedback';
            }
        }, 1500);
    }

    endMathQuiz(gameState) {
        clearInterval(gameState.timer);
        
        const container = document.getElementById('gameArea');
        container.innerHTML = `
            <div class="game-results">
                <h3>Quiz Complete! 🎉</h3>
                <div class="final-score">Final Score: ${gameState.score}</div>
                <div class="accuracy">
                    Accuracy: ${Math.round((gameState.score / (gameState.maxQuestions * 10)) * 100)}%
                </div>
                <button onclick="gamesManager.closeGame()" class="btn-primary">Continue</button>
            </div>
        `;

        if (typeof progressManager !== 'undefined') {
            const bonus = gameState.score > 70 ? 10 : 0;
            progressManager.addXP(bonus);
        }
    }

    cleanupMathQuiz() {
        // Clean up any timers or intervals
    }

    // Science Lab Game
    initScienceLab(container) {
        const gameState = {
            currentExperiment: 0,
            experimentsCompleted: 0,
            score: 0
        };

        const experiments = [
            {
                title: "Mix Colors",
                description: "What happens when you mix red and blue?",
                options: ["Purple", "Green", "Orange", "Yellow"],
                correct: 0,
                visual: "🔴 + 🔵 = ?"
            },
            {
                title: "States of Water",
                description: "What happens to water when it gets very cold?",
                options: ["It becomes gas", "It becomes solid", "It disappears", "It becomes hot"],
                correct: 1,
                visual: "💧 ➡️ ❄️"
            },
            {
                title: "Plant Growth",
                description: "What do plants need to grow?",
                options: ["Only water", "Only sunlight", "Water and sunlight", "Nothing"],
                correct: 2,
                visual: "🌱 + ? = 🌳"
            }
        ];

        const gameHTML = `
            <div class="science-lab-game">
                <div class="lab-header">
                    <h3>Virtual Science Lab 🧪</h3>
                    <div class="score">Score: <span id="scienceScore">0</span></div>
                </div>
                <div class="experiment-area" id="experimentArea"></div>
            </div>
        `;

        container.innerHTML = gameHTML;
        this.showExperiment(gameState, experiments);
    }

    showExperiment(gameState, experiments) {
        const experiment = experiments[gameState.currentExperiment];
        const area = document.getElementById('experimentArea');

        area.innerHTML = `
            <div class="experiment">
                <div class="experiment-visual">${experiment.visual}</div>
                <h4>${experiment.title}</h4>
                <p>${experiment.description}</p>
                <div class="experiment-options" id="experimentOptions"></div>
            </div>
        `;

        const optionsContainer = document.getElementById('experimentOptions');
        experiment.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'experiment-btn';
            button.onclick = () => this.checkScienceAnswer(gameState, experiments, index, experiment.correct);
            optionsContainer.appendChild(button);
        });
    }

    checkScienceAnswer(gameState, experiments, selectedIndex, correctIndex) {
        const buttons = document.querySelectorAll('.experiment-btn');
        buttons.forEach(btn => btn.disabled = true);

        buttons[correctIndex].classList.add('correct');
        if (selectedIndex !== correctIndex) {
            buttons[selectedIndex].classList.add('wrong');
        }

        if (selectedIndex === correctIndex) {
            gameState.score += 20;
            document.getElementById('scienceScore').textContent = gameState.score;
        }

        setTimeout(() => {
            gameState.currentExperiment++;
            gameState.experimentsCompleted++;

            if (gameState.currentExperiment >= experiments.length) {
                this.endScienceLab(gameState);
            } else {
                this.showExperiment(gameState, experiments);
            }
        }, 2000);
    }

    endScienceLab(gameState) {
        const container = document.getElementById('gameArea');
        container.innerHTML = `
            <div class="game-results">
                <h3>Lab Session Complete! 🧪</h3>
                <div class="final-score">Total Score: ${gameState.score}</div>
                <div class="completion">
                    Experiments Completed: ${gameState.experimentsCompleted}
                </div>
                <button onclick="gamesManager.closeGame()" class="btn-primary">Continue</button>
            </div>
        `;

        if (typeof progressManager !== 'undefined') {
            const bonus = gameState.score >= 40 ? 15 : 0;
            progressManager.addXP(bonus);
        }
    }

    cleanupScienceLab() {
        // Clean up if needed
    }

    // Pattern Game
    initPatternGame(container) {
        const gameState = {
            level: 1,
            score: 0,
            currentPattern: [],
            userPattern: [],
            showingPattern: false
        };

        const gameHTML = `
            <div class="pattern-game">
                <div class="pattern-header">
                    <h3>Pattern Master 🎨</h3>
                    <div class="level">Level: <span id="patternLevel">1</span></div>
                    <div class="score">Score: <span id="patternScore">0</span></div>
                </div>
                <div class="pattern-grid" id="patternGrid"></div>
                <div class="pattern-controls">
                    <button id="startPattern" class="btn-primary">Start Pattern</button>
                    <button id="submitPattern" class="btn-primary" disabled>Submit</button>
                </div>
                <div class="pattern-feedback" id="patternFeedback"></div>
            </div>
        `;

        container.innerHTML = gameHTML;

        this.setupPatternGame(gameState);
    }

    setupPatternGame(gameState) {
        const grid = document.getElementById('patternGrid');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        
        grid.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'pattern-cell';
            cell.dataset.index = i;
            cell.style.backgroundColor = colors[i % colors.length];
            cell.onclick = () => this.addToUserPattern(gameState, i);
            grid.appendChild(cell);
        }

        document.getElementById('startPattern').onclick = () => this.startPattern(gameState);
        document.getElementById('submitPattern').onclick = () => this.checkPattern(gameState);
    }

    startPattern(gameState) {
        gameState.currentPattern = [];
        gameState.userPattern = [];
        
        // Generate pattern based on level
        const patternLength = Math.min(2 + gameState.level, 6);
        for (let i = 0; i < patternLength; i++) {
            gameState.currentPattern.push(Math.floor(Math.random() * 9));
        }

        this.showPattern(gameState);
        document.getElementById('startPattern').disabled = true;
        document.getElementById('submitPattern').disabled = true;
    }

    showPattern(gameState) {
        gameState.showingPattern = true;
        let index = 0;

        const showNext = () => {
            if (index < gameState.currentPattern.length) {
                const cellIndex = gameState.currentPattern[index];
                const cell = document.querySelector(`[data-index="${cellIndex}"]`);
                
                cell.classList.add('highlight');
                setTimeout(() => {
                    cell.classList.remove('highlight');
                    index++;
                    setTimeout(showNext, 300);
                }, 500);
            } else {
                gameState.showingPattern = false;
                document.getElementById('patternFeedback').textContent = 'Now repeat the pattern!';
                document.getElementById('submitPattern').disabled = false;
            }
        };

        showNext();
    }

    addToUserPattern(gameState, cellIndex) {
        if (gameState.showingPattern) return;
        
        gameState.userPattern.push(cellIndex);
        const cell = document.querySelector(`[data-index="${cellIndex}"]`);
        cell.classList.add('selected');
        
        setTimeout(() => cell.classList.remove('selected'), 200);
    }

    checkPattern(gameState) {
        const correct = JSON.stringify(gameState.currentPattern) === JSON.stringify(gameState.userPattern);
        const feedback = document.getElementById('patternFeedback');
        
        if (correct) {
            gameState.score += gameState.level * 10;
            gameState.level++;
            feedback.textContent = 'Correct! Moving to next level...';
            feedback.className = 'pattern-feedback correct';
            
            document.getElementById('patternScore').textContent = gameState.score;
            document.getElementById('patternLevel').textContent = gameState.level;
            
            if (gameState.level > 5) {
                this.endPatternGame(gameState);
                return;
            }
            
            setTimeout(() => {
                feedback.textContent = '';
                feedback.className = 'pattern-feedback';
                document.getElementById('startPattern').disabled = false;
            }, 2000);
        } else {
            feedback.textContent = 'Wrong pattern! Try again.';
            feedback.className = 'pattern-feedback wrong';
            
            setTimeout(() => {
                feedback.textContent = '';
                feedback.className = 'pattern-feedback';
                document.getElementById('startPattern').disabled = false;
            }, 2000);
        }
        
        gameState.userPattern = [];
        document.querySelectorAll('.pattern-cell').forEach(cell => {
            cell.classList.remove('selected', 'highlight');
        });
        document.getElementById('submitPattern').disabled = true;
    }

    endPatternGame(gameState) {
        const container = document.getElementById('gameArea');
        container.innerHTML = `
            <div class="game-results">
                <h3>Pattern Master Complete! 🎨</h3>
                <div class="final-score">Final Score: ${gameState.score}</div>
                <div class="levels">Levels Completed: ${gameState.level - 1}</div>
                <button onclick="gamesManager.closeGame()" class="btn-primary">Continue</button>
            </div>
        `;

        if (typeof progressManager !== 'undefined') {
            const bonus = gameState.score > 100 ? 20 : 0;
            progressManager.addXP(bonus);
        }
    }

    cleanupPatternGame() {
        // Clean up if needed
    }
}

// Add game-specific CSS
const gameStyles = document.createElement('style');
gameStyles.textContent = `
    .math-quiz-game .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .question-area {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .question {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 2rem;
        color: #1f2937;
    }
    
    .answers {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .answer-btn, .experiment-btn {
        padding: 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        background: white;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .answer-btn:hover, .experiment-btn:hover {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
    }
    
    .answer-btn:disabled, .experiment-btn:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    .experiment-btn.correct {
        background: #10b981;
        color: white;
        border-color: #10b981;
    }
    
    .experiment-btn.wrong {
        background: #ef4444;
        color: white;
        border-color: #ef4444;
    }
    
    .feedback {
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
    }
    
    .feedback.correct {
        background: #dcfce7;
        color: #166534;
    }
    
    .feedback.wrong {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .science-lab-game .lab-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .experiment {
        text-align: center;
        max-width: 500px;
        margin: 0 auto;
    }
    
    .experiment-visual {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .experiment h4 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #1f2937;
    }
    
    .experiment p {
        font-size: 1.1rem;
        color: #6b7280;
        margin-bottom: 2rem;
    }
    
    .experiment-options {
        display: grid;
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .pattern-game .pattern-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    
    .pattern-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        max-width: 300px;
        margin: 0 auto 2rem auto;
    }
    
    .pattern-cell {
        aspect-ratio: 1;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 3px solid transparent;
    }
    
    .pattern-cell.highlight {
        border-color: #fbbf24;
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
    }
    
    .pattern-cell.selected {
        border-color: #3b82f6;
        transform: scale(0.95);
    }
    
    .pattern-controls {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .pattern-controls button {
        margin: 0 0.5rem;
    }
    
    .pattern-feedback {
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
        padding: 1rem;
        border-radius: 8px;
    }
    
    .pattern-feedback.correct {
        background: #dcfce7;
        color: #166534;
    }
    
    .pattern-feedback.wrong {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .game-results {
        text-align: center;
        padding: 2rem;
    }
    
    .game-results h3 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #1f2937;
    }
    
    .final-score, .accuracy, .completion, .levels {
        font-size: 1.3rem;
        margin: 1rem 0;
        padding: 1rem;
        background: #f0f9ff;
        border-radius: 8px;
        color: #0369a1;
        font-weight: bold;
    }
`;
document.head.appendChild(gameStyles);

// Initialize games manager
let gamesManager;
document.addEventListener('DOMContentLoaded', () => {
    gamesManager = new GamesManager();
});

// Global function for playing games
function playGame(gameId) {
    if (gamesManager) {
        gamesManager.playGame(gameId);
    }
}

// Global function for closing games
function closeGame() {
    if (gamesManager) {
        gamesManager.closeGame();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamesManager;
}