import React, { useState, useEffect } from "react";
import API from "../api/axiosConfig";

function Comment({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");


  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await API.get(`/posts/${postId}/comments/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        `/posts/${postId}/comments/`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setText(""); 
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  const handleEditComment = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(
        `/comments/${editingComment.id}/`,
        { text: editText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
  
      const updatedComment = response.data;
  
      console.log('Updated Comment:', updatedComment);
  
      // Update the comment in the state using its ID
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
  
      // Reset editing states
      setEditingComment(null);
      setEditText("");
      fetchComments();
    } catch (error) {
      console.error("Error editing comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  return (
    <div>
      <h5>Comments</h5>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {editingComment?.id === comment.id ? (
              <form onSubmit={handleEditComment}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  required
                />
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={() => setEditingComment(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span>{comment.text}</span>
                <button
                  onClick={() => {
                    setEditingComment(comment);
                    setEditText(comment.text);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
}

export default Comment;
