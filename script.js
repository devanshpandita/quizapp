const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

const startForm = document.getElementById('start-form');
const quizContainer = document.getElementById('quiz-container');
let currentQuestion = 0;
let score = 0;
let questions = [];

startForm.addEventListener('submit', startQuiz);

function startQuiz(e) {
  e.preventDefault();

  const nameInput = document.getElementById('name-input');
  const categorySelect = document.getElementById('category-select');
  const difficultySelect = document.getElementById('difficulty-select');

  const name = nameInput.value;
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;

  if (!name || !category || !difficulty) {
    alert('Please fill in all fields!');
    return;
  }

  startForm.style.display = 'none';
  quizContainer.style.display = 'block';

  fetch(`${API_URL}&category=${category}&difficulty=${difficulty}`)
    .then(response => response.json())
    .then(data => {
      questions = data.results;
      renderQuestion();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while fetching questions. Please try again later.');
    });
}

function renderQuestion() {
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }

  const question = questions[currentQuestion];
  const answers = [...question.incorrect_answers, question.correct_answer];
  const shuffledAnswers = shuffleArray(answers);

  const quizDiv = document.createElement('div');
  quizDiv.innerHTML = `
    <h2>Question ${currentQuestion + 1}</h2>
    <p>${question.question}</p>
    ${shuffledAnswers.map(answer => `
      <button class="answer-button">${answer}</button>
    `).join('')}
  `;

  quizContainer.innerHTML = '';
  quizContainer.appendChild(quizDiv);

  const answerButtons = document.getElementsByClassName('answer-button');
  for (const button of answerButtons) {
    button.addEventListener('click', handleAnswer);
  }
}

function handleAnswer(e) {
  const selectedAnswer = e.target.innerText;
  const question = questions[currentQuestion];

  if (selectedAnswer === question.correct_answer) {
    score++;
  }

  currentQuestion++;
  renderQuestion();
}

function showResult() {
  quizContainer.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your score: ${score}/${questions.length}</p>
  `;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function handleAnswer(e) {
  const selectedAnswer = e.target.innerText;
  const question = questions[currentQuestion];

  const answerButtons = document.getElementsByClassName('answer-button');
  for (const button of answerButtons) {
    button.removeEventListener('click', handleAnswer);
  }

  const correctAnswer = question.correct_answer;
  const answerElements = Array.from(answerButtons);
  const selectedButton = answerElements.find(button => button.innerText === selectedAnswer);
  const correctButton = answerElements.find(button => button.innerText === correctAnswer);

  if (selectedAnswer === correctAnswer) {
    selectedButton.classList.add('correct');
    score++;
  } else {
    selectedButton.classList.add('incorrect');
    correctButton.classList.add('correct');
  }

  setTimeout(() => {
    currentQuestion++;
    renderQuestion();
  }, 2000);
}
 