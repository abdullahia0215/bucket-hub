import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [userID, setUserID] = useState('');
  const history = useHistory();

  useEffect(() => {
    axios.get('/api/user')
      .then((response) => {
        console.log('User ID:', response.data.id);
        setUserID(response.data.id);
      })
      .catch((error) => {
        console.error('Error fetching user ID:', error);
      });
  }, []);
  
  console.log('userID:', userID); // Check the value of userID after the useEffect

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.get('/api/groups/check')
      .then((response) => {
        if (response.data.hasCreatedGroup) {
          alert('You can only create one group.');
        } else {
          const groupData = {
            group_name: groupName,
            user_id: userID,
            admin: true,
            creator_id: userID // Set creator_id to the current user's ID
          };

          axios.post('/api/createGroup', groupData)
            .then((response) => {
              console.log('Group and user group created successfully:', response.data);
              // Redirect to a success page or do something else
            })
            .catch((error) => {
              console.error('Error creating group and user group:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error checking user\'s group:', error);
      });
  };

  return (
    <div>
      <h2>Create a New Group</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group Name:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Create Group</button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;