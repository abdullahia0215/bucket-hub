import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ShelfItem from "../ShelfItem/ShelfItem";
import axios from "axios";

export default function ShelfPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userId = useSelector((state) => state.user?.id);
  const group = useSelector((state) => state.groupReducer);
  const [hasAccess, setHasAccess] = useState(null);
  const itemList = useSelector((store) => store.itemsReducer);

  const [task, setTask] = useState("");

  console.log(group)



  useEffect(() => {
    // Fetch the group shelf items as before
    dispatch({ type: "FETCH_GROUP_SHELF" });

    // Check if the user has access to this page
    axios
      .get("/api/shelf/checkUserGroupAccess")
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
    return <div className="noBrigadeMessage">Join a brigade first on the "Brigades" page!</div>;
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    axios
      .post("/api/shelf/addTaskGroup", {
        task: task,
        group_id: group.group.id,
        user_id: userId,
      })
      .then((response) => {
        dispatch({ type: "FETCH_GROUP_SHELF" });
        setTask("");
      })
      .catch((error) => {
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

    const group_id = group.group.id;

    try {
      // Send the request to the server to leave the group
      const response = await axios.post("/api/groups/leave", {
        group_id,
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
        onClick={() => {
          handleLeaveGroup();
          window.location.href = "/#/brigades";
        }}
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
      {/* <ul>
        {itemList?.map((item) => (
          <ShelfItem key={item?.id} item={item} />
        ))}
      </ul> */}
    </div>
  );

}