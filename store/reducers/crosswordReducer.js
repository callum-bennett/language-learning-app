import {
  UPDATE_ANSWER,
  SET_ACTIVE_ANSWER,
  SET_ACTIVE_CELL,
  START_CROSSWORD,
  CLEAR_ACTIVE_ANSWER,
  SHOW_ANSWERS,
  CHECK_ANSWERS,
  MARK_ANSWER_CORRECT,
} from "../actions/crossword";
import { arrayToObjectByKey } from "../../util";
import { drawCrossword } from "../../utils/crosswordGenerator";

const initialState = {
  initialized: false,
  activeCell: null,
  activeAnswerText: null,
  complete: false,
  dirty: false,
  answers: {},
};

export const ANSWER_INCOMPLETE = "incomplete";
export const ANSWER_INCORRECT = "incorrect";
export const ANSWER_CORRECT = "correct";

export default (state = initialState, action) => {
  switch (action.type) {
    case START_CROSSWORD: {
      const config = action.payload;
      const grid = drawCrossword(config);
      const answersByKey = arrayToObjectByKey(config.answers, "text");

      Object.keys(answersByKey).forEach((key) => {
        answersByKey[key].currentGuess = "";
        answersByKey[key].status = ANSWER_INCOMPLETE;
      });

      return {
        ...state,
        grid,
        initialized: true,
        answers: answersByKey,
      };

      break;
    }

    case SET_ACTIVE_ANSWER: {
      const { answerText } = action.payload;
      let newState = { ...state, activeAnswerText: answerText };

      const answer = state.answers[answerText];

      if (!state.activeCell || !answer.cells.includes(state.activeCell)) {
        newState.activeCell = state.answers[answerText].cells[0];
      }

      return newState;

      break;
    }

    case CLEAR_ACTIVE_ANSWER: {
      return {
        ...state,
        activeAnswerText: initialState.activeAnswerText,
        activeCell: initialState.activeCell,
      };
      break;
    }

    case MARK_ANSWER_CORRECT: {
      const activeAnswerText = action.payload;

      let newState = { ...state };
      newState.answers[activeAnswerText].status = ANSWER_CORRECT;
      newState.answers[activeAnswerText].cells.forEach(({ x, y }) => {
        newState.grid[y - 1][x - 1].locked = true;
      });
      newState.activeAnswerText = null;

      return newState;
    }

    case UPDATE_ANSWER: {
      const text = action.payload;
      const { answers, activeAnswerText } = state;
      const activeAnswer = answers[activeAnswerText];
      const activeCell = activeAnswer.cells[text.length];

      let newState = { ...state, dirty: true, activeCell };

      for (let index in activeAnswer.cells) {
        const { x, y } = activeAnswer.cells[index];
        if (!newState.grid[y - 1][x - 1].locked) {
          newState.grid[y - 1][x - 1].value = text[index] ?? "";
        }
      }
      activeAnswer.currentGuess = text;

      return newState;
    }

    case SHOW_ANSWERS: {
      let newState = { ...state };

      Object.values(newState.answers).forEach((answer) => {
        answer.currentGuess = answer.text;
        answer.status = ANSWER_CORRECT;
      });

      newState.grid.forEach((row) => {
        row.forEach((cell) => {
          if (cell) {
            cell.value = cell.correctValue;
          }
        });
      });

      return newState;
    }

    case CHECK_ANSWERS: {
      let newState = { ...state };

      Object.values(newState.answers).forEach((answer) => {
        const match = answer.text === answer.currentGuess;
        if (match) {
          answer.status = ANSWER_CORRECT;
        } else {
          answer.status = ANSWER_INCORRECT;
        }
      });

      return newState;
    }

    case SET_ACTIVE_CELL: {
      let activeCell = action.payload;

      return {
        ...state,
        activeCell,
      };
      break;
    }

    default:
      return state;
  }
};
