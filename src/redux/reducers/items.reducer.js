
const myItemsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_GROUP_ITEMS':
          return action.payload;
        case 'ADD_GROUP_ITEM':
          return [...state, action.payload];
        case 'EDIT_GROUP_ITEM':
          return state.map(item => item.id === action.payload.id ? action.payload : item);
        case 'COMPLETE_GROUP_ITEM':
          return state.map(item => item.id === action.payload.id ? { ...item, completed: true } : item);
        case 'DELETE_GROUP_ITEM':
          return state.filter(item => item.id !== action.payload.id);
        default:
          return state;
    }
};

export default myItemsReducer;
