import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Togglable from './components/Toggable';
import loginService from './services/login';
import CreateForm from './components/CreateForm';

import Notification from './components/Notification';
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const blogFormRef = useRef();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);

      setUsername('');
      setPassword('');
    } catch (error) {
      console.log(error);
      setMessage(`Error : ${error.response.data.error}`);
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    }
  };
  const handleNewBlog = async (newObj) => {
    try {
      console.log(blogFormRef);
      blogFormRef.current.toggleVisibility();
      const newBlog = await blogService.createNewBlog(newObj);
      if (!newBlog) return;
      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      setMessage(`New Blog ${newBlog.title} by ${newBlog.author} added.`);
      setTimeout(() => {
        setMessage(null);
      }, 500);
    } catch (error) {
      console.log(error.message);
      setMessage(`Error : ${error.message}`);
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    }
  };
  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>Log into the application</h1>
      <div>
        username
        <input
          type='text'
          id='username'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          id='password'
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  );
  const updateLikes = async (id, newObj) => {
    try {
      const updatedBlog = await blogService.updateBlog(id, newObj);

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog.id === id ? updatedBlog : blog))
      );
    } catch (error) {
      setMessage(`Error : ${error.response.data.error}`);
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    }
  };
  const deleteBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      setMessage('Blog Deleted');
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    } catch (error) {
      setMessage(`Error : ${error.response.data.error}`);
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    }
  };
  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogUser');
  };
  return (
    <>
      {!user && loginForm()}
      <Notification message={message} />
      {user && (
        <div>
          <h1>Blogs</h1>
          <h4>
            {user.name} is logged in{' '}
            <button type='button' onClick={handleLogout}>
              logout
            </button>
          </h4>
          {
            <Togglable buttonLabel='Create new blog!' ref={blogFormRef}>
              <CreateForm handleNewBlog={handleNewBlog} />
            </Togglable>
          }
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLikes={updateLikes}
                deleteBlog={deleteBlog}
              />
            ))}
        </div>
      )}
    </>
  );
};

export default App;
