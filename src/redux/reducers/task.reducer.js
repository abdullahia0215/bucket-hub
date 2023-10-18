 // Define the initial state
const initialState = {
    tasks: [],
    isLoading: false,
    error: null
  };
  
  // Define the action types
  const ADD_TASK = 'ADD_TASK';
  const DELETE_TASK = 'DELETE_TASK';
  
  // Define the reducer function
  const taskReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_TASK:
        return {
          ...state,
          tasks: [...state.tasks, action.payload]
        };
      case DELETE_TASK:
        return {
          ...state,
          tasks: state.tasks.filter(task => task.id !== action.payload)
        };
      default:
        return state;
    }
  };
  
  export default taskReducer;