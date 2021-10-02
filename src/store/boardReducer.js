const initState = {
  usersData: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_USERBOARD_DATA":
      return {
        ...state,
        usersData: action.usersData,
      };
    default:
      return state;
  }
};

export default reducer;
