import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./ShelfPage.css";
import axios from "axios";

export default function ShelfPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userId = useSelector((state) => state.user?.id);
  const group = useSelector((state) => state.groupReducer);
  console.log("group:", group);

  const [task, setTask] = useState("");

  useEffect(() => {
    dispatch({ type: "FETCH_ITEMS" });
  }, []);

  const itemList = useSelector((store) => store.itemsReducer);

  const handleAddTask = () => {
    console.log("Handle add task:", task);
    if (group && group.group) {

      dispatch({
        type: 'ADD_GROUP_ITEM',
        payload: { task, group_id: group.group.id }
      });
    } else {
      console.error("Group or group.group is undefined");
    }
    setTask('');
};

  

const handleLeaveGroup = async () => {
  // Ensure that group and group.group are both not null before proceeding
  if (!group || !group.group) {
    console.error("Group data is not available.");
    return; // Exit the function early
  }

  const groupId = group.group.id;

  try {
    // Send the request to the server to leave the group
    const response = await axios.post("/api/groups/leave", { groupId, userId });

    // Log the response or handle any post-request logic
    console.log("Left group successfully:", response.data);

    // If necessary, update your local state or dispatch a Redux action
    dispatch({ type: "UNSET_GROUP" });

  } catch (error) {
    console.error("Error leaving group:", error);
  }
};


  return (
    <div className="container">
      <h2>Group List</h2>

      <button
        onClick={handleLeaveGroup}
        color="danger"
        style={{ marginBottom: "10px" }}
      >
        Leave Group
      </button>
          <form>
            <input
              className="form-control"
              placeholder="Add Item"
              required
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <br />
            <br />
            <button onClick={() => history.push("/shelf")}>Cancel</button>
            <button color="primary" onClick={handleAddTask}>
              Add Item
            </button>
          </form>
      <ul>
        {itemList.map((item) => (
          <ShelfItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );

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
            color="danger"
          >
            Delete
          </button>
        )}
        <button onClick={() => handleEdit()} style={{ marginLeft: "10px" }}>
          Edit
        </button>

        <br />
        <br />
      </li>
    );
  }
}
