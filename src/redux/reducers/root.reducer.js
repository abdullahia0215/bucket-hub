import { combineReducers } from 'redux';
import groupReducer from './group.reducer';
import userReducer from './user.reducer';
import taskReducer from './task.reducer';


const rootReducer = combineReducers({
    taskReducer,
    userReducer,
    groupReducer
});

export default rootReducer;