export const setGroup = (group) => ({
    type: 'SET_GROUP',
    payload: group
});

export const unsetGroup = () => ({
    type: 'UNSET_GROUP'
});

// Reducer
const initialState = {
    group: null
};

const groupReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_GROUP':
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
}

export default groupReducer;
