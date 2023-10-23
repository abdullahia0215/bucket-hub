
const myItemsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_MY_ITEMS':
          return action.payload;
        case 'ADD_TASK':
          return [...state, action.payload];
        case 'EDIT_TASK':
          return state.map(item => item.id === action.payload.id ? action.payload : item);
        case 'COMPLETE_TASK':
          return state.map(item => item.id === action.payload.id ? { ...item, completed: true } : item);
        case 'DELETE_TASK':
          return state.filter(item => item.id !== action.payload.id);
        default:
          return state;
    }
};

export default myItemsReducer;
