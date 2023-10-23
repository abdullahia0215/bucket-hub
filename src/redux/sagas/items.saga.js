import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

// function to get all items from database for the user's personal shelf
function* fetchMyShelf() {
  try {
    const items = yield axios.get("/api/myShelf");
    console.log("FETCH request from fetchMyShelf saga");
    yield put({ type: "SET_MY_ITEMS", payload: items.data });
  } catch (error) {
    console.log("error in fetchMyShelf saga", error);
  }
}

function* addItemSaga(action) {
  try {
    yield axios.post("/api/myShelf", action.payload);
    yield put({ type: "FETCH_MY_SHELF" });
  } catch (error) {
    console.log("error in addItemSaga", error);
  }
}

function* deleteItemSaga(action) {
  try {
    yield axios.delete(`/api/myShelf/${action.payload}`);
    yield put({ type: "FETCH_MY_SHELF" });
  } catch (error) {
    console.log("error with DELETE saga request", error);
  }
}

function* editItemSaga(action) {
  try {
    yield axios.put(`/api/myShelf/${action.payload.id}`, action.payload);
    yield put({ type: "FETCH_MY_SHELF" });
  } catch (error) {
    console.log("Error in editing item", error);
  }
}

function* completeItemSaga(action) {
  try {
    console.log("action.payload.id:", action.payload.id);
    // Assuming there's an endpoint to mark an item as complete
    yield axios.put(`/api/myShelf/complete/${action.payload.id}`);
    yield put({ type: "FETCH_MY_SHELF" });
  } catch (error) {
    console.log("Error in completing item", error);
  }
}
function* fetchGroupItemsSaga(action) {
  try {
    const items = yield axios.get(`/api/groups/${action.payload}`);
    console.log("FETCH request from fetchGroupItemsSaga saga");
    yield put({ type: "SET_GROUP_ITEMS", payload: items.data });
  } catch (error) {
    console.log("error in fetchGroupItemsSaga saga", error);
  }
}
export default function* itemsSaga() {
  yield takeEvery("FETCH_MY_SHELF", fetchMyShelf);
  yield takeEvery("ADD_ITEM", addItemSaga);
  yield takeEvery("DELETE_ITEM", deleteItemSaga);
  yield takeEvery("EDIT_ITEM", editItemSaga);
  yield takeEvery("COMPLETE_ITEM", completeItemSaga);
}
