import React, { useState } from 'react';
import axios from 'axios';

function CreateGroup() {
  // State variables to capture group information
  const [groupName, setGroupName] = useState('');

  // Event handler for form submission
  const handleSubmit = (e) => {
    alert('Group created!');
    e.preventDefault();

    // Create a new group object
    const newGroup = {
      group_name: groupName,
      // You can add more properties if needed
    };

    // Make a POST request to create a new group
    axios.post('/api/groups', newGroup)
      .then((response) => {
        // Handle success, e.g., show a success message or redirect
        console.log('Group created successfully:', response.data);
        history.push('/groups');
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message
        console.error('Error creating group:', error);
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
        {/* You can add more form fields as needed */}
        <div>
          <button type="submit">Create Group</button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;
