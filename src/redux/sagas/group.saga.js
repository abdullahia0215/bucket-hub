import { put, takeEvery, all } from 'redux-saga/effects';
import axios from 'axios';

// API endpoint for fetching groups
const GROUPS_URL = '/api/groups';

// Worker saga to handle the FETCH_GROUPS_REQUEST action
function* fetchGroups() {
  try {
    // Perform the API call to fetch groups using Axios
    const response = yield axios.get(GROUPS_URL);

    // Extract the groups from the response data
    const groups = response.data;

    // Dispatch the FETCH_GROUPS_SUCCESS action with the fetched groups
    yield put({ type: FETCH_GROUPS_SUCCESS, payload: groups });
  } catch (error) {
    // Dispatch the FETCH_GROUPS_FAILURE action with the error message
    yield put({ type: FETCH_GROUPS_FAILURE, payload: error.message });
  }
}

// Watcher saga to listen for FETCH_GROUPS_REQUEST action
function* watchFetchGroups() {
  yield takeEvery(FETCH_GROUPS_REQUEST, fetchGroups);
}

// Root saga to combine all sagas
export default function* groupSaga() {
  yield all([watchFetchGroups()]);
}