const url = "https://opentdb.com/api.php?amount=10";

//query selectors
let questionBox = document.querySelector(".questions-container");
let scoreCard = document.querySelector(".score");
let startButton = document.querySelector('.start-button');
let nextButton = document.querySelector('.next-button');
let categories = document.querySelectorAll('a');
let dropdown = document.querySelector('.dropdown');

//global variables
let score = 0;
let index = 0;

//global arrays
let questionsArray = [];

//event listeners
startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', nextQuestion);
for (let i = 0; i < categories.length; i++){
  categories[i].addEventListener('click', changeCategory);
}

//functions
async function fetchQuestions() {
  let response = await axios(url);
  questionsArray.push(...response.data.results);
}
fetchQuestions();

function displayUI() {
    let newQuestions = [
      {
        choice: questionsArray[index].incorrect_answers[0],
        answer: "incorrect",
      },
      {
        choice: questionsArray[index].incorrect_answers[1],
        answer: "incorrect",
      },
      {
        choice: questionsArray[index].incorrect_answers[2],
        answer: "incorrect",
      },
      {
        choice: questionsArray[index].correct_answer,
        answer: "correct",
      },
    ];

    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }

    shuffle(newQuestions);

    let htmlTemplate = `
      <div class="card">
        <h1>${questionsArray[index].question}</h1>
        <button class='answer ${newQuestions[0].answer}'>${newQuestions[0].choice}</button>
        <button class='answer ${newQuestions[1].answer}'>${newQuestions[1].choice}</button>
        <button class='answer ${newQuestions[2].answer}'>${newQuestions[2].choice}</button>
        <button class='answer ${newQuestions[3].answer}'>${newQuestions[3].choice}</button>
      </div>
    `;
    questionBox.insertAdjacentHTML("beforeend", htmlTemplate);
  ;
}

function startGame() {
  index = 0;
  score = 0;
  fetchQuestions();
  displayUI();
  resetGame();
  document.querySelector('.card').classList.remove('hide');
  startButton.classList.add('hide');
  dropdown.classList.add('hide');
  checkAnswer();
}

function checkAnswer() {
  let answerChoices = document.querySelectorAll(".answer");
  for (let i = 0; i < answerChoices.length; i++) {
    answerChoices[i].addEventListener("click", determineCorrect);
    function determineCorrect() {
      answerChoices[i].disabled = true;
      if (answerChoices[i].classList.contains("correct")) {
        answerChoices[i].style.background = 'green';
        score = score + 10;
        displayScore();
        nextButton.classList.remove('hide');
        nextButton.classList.add('show');
      } else {
        answerChoices[i].style.background = 'red';
        score = score + 0;
        displayScore();
        nextButton.classList.remove('hide');
        nextButton.classList.add('show');
      }
    }
  }
}

function displayScore() {
  let htmlTemplate = `
  <h1>Score: ${score}</h1>
  `;
  scoreCard.innerText = "";
  scoreCard.insertAdjacentHTML("beforeend", htmlTemplate);
}
displayScore();

function myFunction() {
  document.getElementById("myDropdown").childElementCountlassList.toggle("show");
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function nextQuestion() {
  let questionCard = document.querySelector('.card');
  console.log(questionCard.classList);
  questionCard.classList.add('hide');
  questionCard.remove();
  index++
  console.log(index);
  if (index === 10) {
    console.log(score);
    alert(`Congratulations! Your final score was ${score}!`);
    nextButton.classList.remove('show');
    nextButton.classList.add('hide');
    questionsArray = [];
    fetchQuestions();
    startButton.classList.remove('hide');
    startButton.classList.add('show');
    document.querySelector('.card').classList.add('hide');
  }
  displayUI();
  checkAnswer();
}

function changeCategory(event) {
  document.getElementById("myDropdown").classList.toggle("hide");
  questionBox.innerHTML = ""
  async function generateURL() {
    let response = await axios("https://opentdb.com/api.php?amount=10&category=" + event.target.className);
    questionsArray = [];
    questionsArray.push(...response.data.results);
    console.log(questionsArray);
  }
  generateURL();
}

function resetGame() {
  console.log(score);
  score = 0;
  displayScore();
}