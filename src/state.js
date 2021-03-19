import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import produce from "immer";
import { ActionTypes, updateTimeSpent, timeoutQuiz } from "./actions";

const initialState = {
  quizInProgress: null,
  questions: null,
  currentIdx: -1,
  alert: "Loading"
};

function rootReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case ActionTypes.START_QUIZ:
      return produce(initialState, (draft) => {
        const t = Date.now();
        if (t < action.quiz.start.getTime()) {
          draft.alert =
            "Quiz has not started yet. Quiz will start at " + action.quiz.start;
          return;
        }
        if (t > action.quiz.end.getTime()) {
          draft.alert = "Quiz has ended at " + action.quiz.end;
          return;
        }
        draft.quizInProgress = true;
        draft.quiz = action.quiz;
        draft.questions = action.questions;
        draft.currentIdx = 0;
        if (draft.questions.length > 0) {
          draft.alert = null;
        } else {
          draft.alert = "There are no questions";
        }
      });
    case ActionTypes.TIMEOUT_QUIZ:
      return produce(state, (draft) => {
        draft.quizInProgress = false;
        draft.alert = "Quiz has ended.";
      });
    case ActionTypes.CURRENT_ANSWER_CHANGED:
      return produce(state, (draft) => {
        const currentQuestion = draft.questions[draft.currentIdx];
        // edit answer only if difficulty is selected
        if (!currentQuestion.difficulty) return;
        currentQuestion.answer = action.value;
        currentQuestion._sync_last_update = Date.now();
      });
    case ActionTypes.SELECT_DIFFICULTY:
      return produce(state, (draft) => {
        const currentQuestion = draft.questions[draft.currentIdx];
        currentQuestion.difficulty = action.value;
        currentQuestion._sync_last_update = Date.now();
      });
    case ActionTypes.UPDATE_TIME_SPENT:
      return produce(state, (draft) => {
        if (draft.currentIdx < 0) return;
        const currentQuestion = draft.questions[draft.currentIdx];
        if (!currentQuestion) return;
        currentQuestion.time_spent =
          (currentQuestion.time_spent || 0) + action.delta;
        currentQuestion._sync_last_update = Date.now();
      });
    case ActionTypes.NEXT_QUESTION:
      return produce(state, (draft) => {
        if (draft.currentIdx === Object.keys(draft.questions).length - 1)
          return state;
        draft.currentIdx++;
      });
    case ActionTypes.PREV_QUESTION:
      return produce(state, (draft) => {
        if (draft.currentIdx === 0) return state;
        draft.currentIdx--;
      });
    case ActionTypes.GOTO_QUESTION:
      return produce(state, (draft) => {
        draft.currentIdx = action.idx;
      });
    default:
      return state;
  }
}

const store = createStore(rootReducer, applyMiddleware(thunk));

export function initTimeSpentWatcher() {
  let lastTimeSpentUpdate = Date.now();
  return setInterval(() => {
    let t = Date.now();

    const { quiz, quizInProgress } = store.getState();
    if (quizInProgress) {
      store.dispatch(updateTimeSpent(t - lastTimeSpentUpdate));
      lastTimeSpentUpdate = t;
    }

    if (quizInProgress && t > quiz.end.getTime()) {
      store.dispatch(timeoutQuiz());
    }
  }, 1000);
}

export default store;
