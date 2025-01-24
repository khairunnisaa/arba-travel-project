import React, { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import { useParams } from 'react-router-dom';

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${postId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setPost(response.data);
        setComments(response.data.comments); 
      } catch (error) {
        console.error(error);
        alert('Failed to fetch post');
      }
    };
    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        `/posts/${postId}/comments/`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );
      setComments([...comments, response.data]);
      setCommentText('');
    } catch (error) {
      console.error(error);
      alert('Failed to add comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await API.delete(`/posts/${postId}/comments/${commentId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error(error);
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="container mt-5">
      {post ? (
        <>
          <h2>{post.caption}</h2>
          <hr />
          <h4>Comments</h4>
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Comment</button>
          </form>
          <ul className="list-group mt-3">
            {comments.map((comment) => (
              <li key={comment.id} className="list-group-item">
                {comment.text}
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleCommentDelete(comment.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
}

export default Post;
