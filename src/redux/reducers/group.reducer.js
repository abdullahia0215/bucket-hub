
const initialState = {
    groups: [],
    isLoading: false,
    error: null,
  };
  
  // Action types
  const FETCH_GROUPS_REQUEST = 'FETCH_GROUPS_REQUEST';
  const FETCH_GROUPS_SUCCESS = 'FETCH_GROUPS_SUCCESS';
  const FETCH_GROUPS_FAILURE = 'FETCH_GROUPS_FAILURE';
  
  // Action creators
  const fetchGroupsRequest = () => ({
    type: FETCH_GROUPS_REQUEST,
  });
  
  const fetchGroupsSuccess = (groups) => ({
    type: FETCH_GROUPS_SUCCESS,
    payload: groups,
  });
  
  const fetchGroupsFailure = (error) => ({
    type: FETCH_GROUPS_FAILURE,
    payload: error,
  });
  
  // Reducer
  const groupReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_GROUPS_REQUEST:
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      case FETCH_GROUPS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          groups: action.payload,
        };
      case FETCH_GROUPS_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default groupReducer;