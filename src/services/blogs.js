import axios from 'axios';
const baseUrl = '/api/blogs';
let token = null;

const setToken = (tkn) => {
  token = `Bearer ${tkn}`;
};
const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.get(baseUrl, config);
  return request.then((response) => response.data);
};

const createNewBlog = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, {
    headers: { Authorization: token },
  });
  return response.data;
};
const updateBlog = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, {
    headers: { Authorization: token },
  });
  return response.data;
};
const deleteBlog = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: token },
  });
  return response.data;
};

export default { getAll, setToken, createNewBlog, updateBlog, deleteBlog };
