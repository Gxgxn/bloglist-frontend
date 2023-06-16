import { useState } from 'react';

const Blog = ({ blog, updateLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingBlock: '1rem',
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 10,
  };
  const handleLike = () => {
    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    updateLikes(blog.id, blogToUpdate);
  };
  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  const visibiltyToggle = { display: visible ? '' : 'none' };
  console.log();
  return (
    <>
      <div style={blogStyle} className='blog'>
        {blog.title}
        <button
          onClick={() => {
            setVisible(!visible);
          }}
        >
          View
        </button>
        <div style={visibiltyToggle} className='blog-data'>
          <a target='_blank' rel='noreferrer' href={blog.url}>
            {blog.url}
          </a>
          <br />
          <span>Likes {blog.likes}</span>
          &nbsp;
          <button onClick={handleLike}>Like</button>
          <br />
          {blog.author === blog.user.name && (
            <button onClick={handleDelete}>Delete</button>
          )}
          <br />
          {blog.author}
        </div>
      </div>
    </>
  );
};

export default Blog;
