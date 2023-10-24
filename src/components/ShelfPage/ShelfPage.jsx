import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  Button,
} from "@mui/material";
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
      })
 }

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

      <Button
        onClick={handleLeaveGroup}
        variant="contained"
        style={{ backgroundColor: "crimson", marginBottom: "10px" }}
      >
        Leave Group
      </Button>
      <Card className="form-card">
        <CardContent>
          <form>
            <FormControl fullWidth>
              <TextField
                className="form-control"
                placeholder="Add Item"
                variant="outlined"
                required
                value={task}
                onChange={(e) => settask(e.target.value)}
              />
            </FormControl>
            <br />
            <br />
            <Button onClick={() => history.push("/shelf")}>Cancel</Button>
            <Button variant="contained" onClick={handleAddTask}>
              Add Item
            </Button>
          </form>
        </CardContent>
      </Card>
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
        <Button
          onClick={() => dispatch({ type: "DELETE_ITEM", payload: item.id })}
          variant="contained"
          style={{ backgroundColor: "crimson" }}
        >
          Delete
        </Button>
      )}
      <Button
        variant="contained"
        onClick={() => handleEdit()}
        style={{ marginLeft: "10px" }}
      >
        Edit
      </Button>

      <br />
      <br />
    </li>
  );
}
