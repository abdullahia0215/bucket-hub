import React, { useState } from "react";
import { useDispatch } from "react-redux";


export default function ShelfItem({ item }) {
    const dispatch = useDispatch();
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
              value={edit}
              onChange={(e) => setEdit(e.target.value)}
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
            Item: {item?.task} <br />
            <br />
          </div>
        )}
        {item?.user_id && (
          <button onClick={() => handleDeleteItem(item.id)} color="danger">
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
