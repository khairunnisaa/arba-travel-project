import React, { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import Comment from './Comment';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await API.get('/posts/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch posts');
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', caption);
    if (image) formData.append('image', image);

    try {
      const response = await API.post('/posts/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setPosts([...posts, response.data]);
      setCaption('');
      setImage(null);
    } catch (error) {
      console.error(error);
      alert('Failed to create post');
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('caption', caption);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await API.put(`/posts/${editingPost.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts(posts.map((post) => (post.id === editingPost.id ? response.data : post)));
      setEditingPost(null); 
      setCaption('');
      setImage(null);
      fetchPosts();
    } catch (error) {
      console.error('Error editing post', error);
      alert('Failed to edit post');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await API.delete(`/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post", error);
      alert("Failed to delete post");
    }
  };

  const startEditingPost = (post) => {
    setEditingPost(post);
    setCaption(post.caption);
    setImage(null); 
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('refresh_token'); 
    window.location.href = '/'; 
  };

  return (
    <div className="container mt-5">
      <div class="d-flex justify-content-between">
        <div>
        <h2>Dashboard</h2>
        </div>
        <div>
        <a href className="btn btn-link" onClick={handleLogout}>
          Logout
        </a>
        </div>
        
      </div>
  

      {/* Form for creating or editing a post */}
      <form onSubmit={editingPost ? handleEditPost : handlePostSubmit}>
        <div className="mb-3">
          <label htmlFor="caption" className="form-label">Caption</label>
          <input
            type="text"
            className="form-control"
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingPost ? 'Update Post' : 'Add Post'}
        </button>
        {editingPost && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setEditingPost(null)}
          >
            Cancel
          </button>
        )}
      </form>

      {/* List of posts */}
      <ul className="list-group mt-3">
        {posts.map((post) => (
          <li key={post.id} className="list-group-item">
            {post.image && <img src={post.image} alt="Post" style={{ width: '200px', marginBottom: '10px' }} />}
            <p>{post.caption}</p>
            <button
              className="btn btn-secondary me-2"
              onClick={() => startEditingPost(post)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeletePost(post.id)}
            >
              Delete
            </button>
            <Comment postId={post.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
