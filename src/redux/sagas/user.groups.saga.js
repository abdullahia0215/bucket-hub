import { takeEvery, put } from "redux-saga/effects";
import axios from "axios";

function* fetchUserGroup () {
    try{
    const group = yield axios.get("/api/user/groups");
    yield put({ type: "SET_GROUP", payload: group.data });
    } catch (error) {
        console.log("error in fetchUserGroup", error);
    }
}


export default function* userGroupsSaga() {
    yield takeEvery("FETCH_USER_GROUP", fetchUserGroup);
}
