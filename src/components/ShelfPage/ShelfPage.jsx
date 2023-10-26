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
  const [hasAccess, setHasAccess] = useState(null);  
  const itemList = useSelector((store) => store.itemsReducer);
  console.log("group:", group);

  const [task, setTask] = useState("");

  useEffect(() => {
    // Fetch the group shelf items as before
    dispatch({ type: "FETCH_GROUP_SHELF" });
  
    // Check if the user has access to this page
    axios.get('/api/shelf/checkUserGroupAccess')
      .then((response) => {
        setHasAccess(response.data.hasAccess);
      })
      .catch((error) => {
        console.error("Error checking user group access:", error);
      });
  }, [dispatch]);
  
  if (hasAccess === null) {
    return <div>Loading...</div>;
  }
  
  // If the user doesn't have access, show an error or redirect
  if (!hasAccess) {
    return <div>Join a brigade first dummy</div>;
  }
  




  const handleAddTask = () => {
    axios.post("/api/shelf/addTaskGroup", {
      task,
      group_id: group.group.id,
      user_id: userId,
    }).then((response) => {
      dispatch({ type: "FETCH_GROUP_SHELF" });
      setTask("");
    }).catch((error) => {
      console.error("Error adding task:", error);
    });
  };
    

  const handleDeleteItem = (itemId) => {
    dispatch({ type: "DELETE_GROUP_ITEM", payload: { id: itemId } });
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
      const response = await axios.post("/api/groups/leave", {
        groupId,
        userId,
      });

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
      <h2>Brigade Dock</h2>

      <button
        onClick={handleLeaveGroup}
        color="danger"
        style={{ marginBottom: "10px" }}
      >
        Leave Brigade
      </button>
      <form>
        <input
          className="form-control"
          placeholder="Add Item"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <br />
        <br />
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
            Item: {task} <br />
            <br />
          </div>
        )}
        {item.user_id && (
          <button
            onClick={() => handleDeleteItem(item.id)}
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
