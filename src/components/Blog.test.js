import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

describe('<Blog />', () => {
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

  let container;
  const likeMockHandler = jest.fn();

  beforeEach(() => {
    container = render(
      <Blog key={blog.id} blog={blog} updateLikes={likeMockHandler} />
    ).container;
  });

  test('renders title and author but not url or likes by default', () => {
    const element = screen.queryByText(blog.title + blog.author);
    const blogData = container.querySelector('.blog-data');
    expect(element).toBeDefined();
    expect(blogData).toHaveStyle('display: none');
  });
  test('url & likes are shown when view button is clicked', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('View');
    await user.click(button);

    const likes = container.querySelector('.likes');
    const url = container.querySelector('.url');
    expect(likes).toHaveTextContent(blog.likes);
    expect(url).toHaveTextContent(blog.url);
  });

  test('Like Button is clicked twice', async () => {
    const users = userEvent.setup();
    const button = screen.getByText('Like');
    await users.click(button);
    await users.click(button);

    expect(likeMockHandler.mock.calls).toHaveLength(2);
  });
});
