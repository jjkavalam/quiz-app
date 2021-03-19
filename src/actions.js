import { fetchQuestions, fetchQuiz } from "./airtable";

export const ActionTypes = {
  START_QUIZ: "START_QUIZ",
  NEXT_QUESTION: "NEXT_QUESTION",
  PREV_QUESTION: "PREV_QUESTION",
  CURRENT_ANSWER_CHANGED: "CURRENT_ANSWER_CHANGED",
  SELECT_DIFFICULTY: "SELECT_DIFFICULTY",
  UPDATE_TIME_SPENT: "UPDATE_TIME_SPENT",
  TIMEOUT_QUIZ: "TIMEOUT_QUIZ",
  GOTO_QUESTION: "GOTO_QUESTION"
};

function triggerImagePreload(urls) {
  urls.forEach((url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
    console.log("preloading", url);
  });
}

export function startQuiz() {
  return async (dispatch) => {
    const quiz = await fetchQuiz();
    const questions = await fetchQuestions();
    // preload images
    triggerImagePreload(questions.map((question) => question.image));
    dispatch({
      type: ActionTypes.START_QUIZ,
      questions,
      quiz
    });
  };
}

export function nextQuestion() {
  return {
    type: ActionTypes.NEXT_QUESTION
  };
}

export function prevQuestion() {
  return {
    type: ActionTypes.PREV_QUESTION
  };
}

export function gotoQuestion(idx) {
  return {
    type: ActionTypes.GOTO_QUESTION,
    idx
  };
}

export function currentAnswerChanged(value) {
  return {
    type: ActionTypes.CURRENT_ANSWER_CHANGED,
    value
  };
}

export function selectDifficulty(value) {
  return {
    type: ActionTypes.SELECT_DIFFICULTY,
    value
  };
}

export function updateTimeSpent(delta) {
  return {
    type: ActionTypes.UPDATE_TIME_SPENT,
    delta
  };
}

export function timeoutQuiz() {
  return {
    type: ActionTypes.TIMEOUT_QUIZ
  };
}
