import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

// function to get all items from database for the user's personal shelf
function* fetchGroupShelf() {
  try {
    const items = yield axios.get("/api/shelf");
    console.log("FETCH request from fetchshelf saga");
    yield put({ type: "SET_GROUP_ITEMS", payload: items.data });
  } catch (error) {
    console.log("error in fetchshelf saga", error);
  }
}

function* addItemSaga(action) {
  try {
    yield axios.post("/api/shelf/addTaskGroup", action.payload);
    yield put({ type: "SET_ITEMS" });
  } catch (error) {
    console.log("error in addItemSaga", error);
  }
}

function* deleteItemSaga(action) {
  try {
    yield axios.delete(`/api/shelf/${action.payload}`);
    yield put({ type: "FETCH_GROUP_SHELF" });
  } catch (error) {
    console.log("error with DELETE saga request", error);
  }
}

function* editItemSaga(action) {
  try {
    yield axios.put(`/api/shelf/${action.payload.id}`, action.payload);
    yield put({ type: "FETCH_GROUP_SHELF" });
  } catch (error) {
    console.log("Error in editing item", error);
  }
}

function* completeItemSaga(action) {
  try {
    console.log("action.payload.id:", action.payload.id);
    yield axios.put(`/api/shelf/complete/${action.payload.id}`);
    yield put({ type: "FETCH_GROUP_SHELF" });
  } catch (error) {
    console.log("Error in completing item", error);
  }
}

export default function* itemsSaga() {
  yield takeEvery("FETCH_GROUP_SHELF", fetchGroupShelf);
  yield takeEvery("ADD_GROUP_ITEM", addItemSaga);
  yield takeEvery("DELETE_GROUP_ITEM", deleteItemSaga);
  yield takeEvery("EDIT_GROUP_ITEM", editItemSaga);
  yield takeEvery("COMPLETE_GROUP_ITEM", completeItemSaga);
}
