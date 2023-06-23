import React from 'react';
import { useState } from 'react';
const CreateForm = ({ handleNewBlog }) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const addNote = (event) => {
    event.preventDefault();
    const newObj = {
      title: title,
      author: author,
      url: url,
    };
    handleNewBlog(newObj);
  };
  return (
    <>
      <form onSubmit={addNote}>
        <h2>Create new blog</h2>
        <div>
          Title
          <input
            type='text'
            value={title}
            name='Title'
            placeholder='Blog title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            type='text'
            value={author}
            name='Author'
            placeholder='Blog author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL
          <input
            type='text'
            value={url}
            name='URL'
            placeholder='Blog url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit' id='create-blog'>
          Create
        </button>
      </form>
    </>
  );
};

export default CreateForm;
