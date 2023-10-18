import { all } from 'redux-saga/effects';
import groupSaga from './group.saga';
import taskSaga from './task.saga';
import userSaga from './user.saga';

export default function* rootSaga() {
    yield all([
        groupSaga(),
        taskSaga(),
        userSaga()
    ]);x
}