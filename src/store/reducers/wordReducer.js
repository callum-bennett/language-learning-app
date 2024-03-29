import { arrayToObjectByKey } from "@utils";
import { FETCH_WORDS } from "@store/actions/types";

const initialState = {
  byId: {},
  allIds: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WORDS:
      const words = action.payload;

      return {
        ...state,
        byId: arrayToObjectByKey(words),
        allIds: words.map((word) => word.id),
      };
      break;

    default:
      return state;
  }
};
