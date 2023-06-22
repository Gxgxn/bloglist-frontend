import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateForm from './CreateForm';
import userEvent from '@testing-library/user-event';

describe('<CreateForm />', () => {
  const blog = {
    title: 'test - title',
    author: 'john doe',
    url: 'https://www.test.com/',
    likes: 0,
    user: {
      username: 'superuser',
      name: 'name',
    },
  };

  //   let container;
  const formHandler = jest.fn();

  beforeEach(() => {
    render(<CreateForm handleNewBlog={formHandler} />);
  });

  test('Creates a new blog', async () => {
    const user = userEvent.setup();

    const titleInput = screen.getByPlaceholderText('Blog title');
    const authorInput = screen.getByPlaceholderText('Blog author');
    const urlInput = screen.getByPlaceholderText('Blog url');
    const sendButton = screen.getByText('Create');

    await user.type(titleInput, blog.title);
    await user.type(authorInput, blog.author);
    await user.type(urlInput, blog.url);
    await user.click(sendButton);

    expect(formHandler.mock.calls).toHaveLength(1);
    expect(formHandler.mock.calls[0][0].title).toBe(blog.title);
    expect(formHandler.mock.calls[0][0].author).toBe(blog.author);
    expect(formHandler.mock.calls[0][0].url).toBe(blog.url);
  });
});
