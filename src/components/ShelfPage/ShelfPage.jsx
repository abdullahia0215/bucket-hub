import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card, CardBody, Input, Button } from "reactstrap";
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
  
  

  const handleLeaveGroup = () => {
    console.log("Left group successfully:", response.data);
    dispatch({ type: "UNSET_GROUP_REQUEST" });
  };

  return (
    <div className="container">
      <h2>Group List</h2>

      <Button
        onClick={handleLeaveGroup}
        color="danger"
        style={{ marginBottom: "10px" }}
      >
        Leave Group
      </Button>
      <Card className="form-card">
        <CardBody>
          <form>
            <Input
              className="form-control"
              placeholder="Add Item"
              required
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <br />
            <br />
            <Button onClick={() => history.push("/shelf")}>Cancel</Button>
            <Button color="primary" onClick={handleAddTask}>
              Add Item
            </Button>
          </form>
        </CardBody>
      </Card>
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
          <Button
            onClick={() => dispatch({ type: "DELETE_ITEM", payload: item.id })}
            color="danger"
          >
            Delete
          </Button>
        )}
        <Button onClick={() => handleEdit()} style={{ marginLeft: "10px" }}>
          Edit
        </Button>

        <br />
        <br />
      </li>
    );
  }
}
