import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./ShelfPage.css";
import axios from "axios";

export default function ShelfPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userId = useSelector((state) => state.user?.id);
  const group = useSelector((state) => state.group);

  const [task, settask] = useState("");

  useEffect(() => {
    dispatch({ type: "FETCH_ITEMS" });
  }, []);

  const itemList = useSelector((store) => store.itemsReducer);

  const handleAddTask = () => {
    axios.post('/api/shelf/addTaskGroup', { task })
      .then(() => {
        dispatch({ type: "FETCH_GROUP_SHELF" });
        settask("");
      });
  };

  const handleLeaveGroup = () => {
    const groupId = group?.id || null;
    axios.post(`/api/groups/leave`, { groupId, userId })
      .then((response) => {
        console.log("Left group successfully:", response.data);
        dispatch({ type: 'UNSET_GROUP_REQUEST' })
      })
      .catch((error) => {
        console.error("Error leaving group:", error);
      });
  };

  return (
    <div className="container">
      <h2>Group List</h2>

      <button
        onClick={handleLeaveGroup}
        style={{ backgroundColor: "crimson", marginBottom: "10px" }}
      >
        Leave Group
      </button>
      <div className="form-card">
        <div className="card-content">
          <form>
            <div>
              <input
                className="form-control"
                placeholder="Add Item"
                required
                value={task}
                onChange={(e) => settask(e.target.value)}
              />
            </div>
            <br />
            <br />
            <button onClick={() => history.push("/shelf")}>Cancel</button>
            <button onClick={handleAddTask}>Add Item</button>
          </form>
        </div>
      </div>
      <ul>
        {itemList.map((item) => (
          <ShelfItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function ShelfItem({ item }) {
  const dispatch = useDispatch();
  const [editDescription, setEditDescription] = useState(item.description);
  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit(!edit);
  };

  const saveEdit = (item) => {
    setEdit(false);
    dispatch({ type: "EDIT_ITEM", payload: item });
  };

  return (
    <li>
      {edit ? (
        <div>
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button className="editBtn" onClick={() => saveEdit(item)}>
            Save
          </button>
          <button className="editBtn" onClick={() => handleEdit(null)}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          Item: {item.description} <br />
          <br />
        </div>
      )}
      {item.user_id && (
        <button
          onClick={() => dispatch({ type: "DELETE_ITEM", payload: item.id })}
          style={{ backgroundColor: "crimson" }}
        >
          Delete
        </button>
      )}
      <button
        onClick={() => handleEdit()}
        style={{ marginLeft: "10px" }}
      >
        Edit
      </button>

      <br />
      <br />
    </li>

  );
}
