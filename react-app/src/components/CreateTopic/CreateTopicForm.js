import React, { useState } from "react";

export default function CreateTopicForm({ onTopicCreated }) {
  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API call to create a new topic
    const response = await fetch("/api/topics/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: topicName,
        description,
      }),
    });

    if (response.ok) {
      const newTopic = await response.json();
      onTopicCreated(newTopic.topic);
      setTopicName("");
      setDescription("");
    } else {
      console.error("Failed to create topic");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Topic Name"
        value={topicName}
        onChange={(e) => setTopicName(e.target.value)}
      />
      <textarea
        placeholder="Topic Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Create Topic</button>
    </form>
  );
}
