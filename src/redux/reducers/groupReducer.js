export const setGroup = (group) => ({
  type: 'SET_GROUP',
  payload: group
});

export const joinGroup = (group) => ({
  type: 'JOIN_GROUP',
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
      return { ...state, group: action.payload };
    
    case 'JOIN_GROUP':
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