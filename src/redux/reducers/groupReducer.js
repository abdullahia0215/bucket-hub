export const setGroup = (group) => ({
  type: 'SET_GROUP',
  payload: group
});

export const unsetGroup = () => ({
  type: 'UNSET_GROUP'
});

const initialState = {
  group: null
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GROUP':
      // Check if the current group is null before setting a new group
      if (state.group === null) {
        return { ...state, group: action.payload };
      }
      // If the current group is not null, simply return the existing state
      return state;
    
    case 'JOIN_GROUP':
      // Similar check can be added here if needed
      return {
        ...state,
        group: action.payload
      };
    case 'UNSET_GROUP':
      return {
        ...state,
        group: null
      };
    default:
      return state;
  }
};

export default groupReducer;
