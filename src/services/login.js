import axios from 'axios';
const baseUrl = '/api/login';

const login = async (userCreds) => {
  const response = await axios.post(baseUrl, userCreds);
  return response.data;
};

export default { login };
