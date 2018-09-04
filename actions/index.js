import axios from 'axios';
import to from 'await-to-js';

import { API_HOST } from '../configs/client';

export const getAllMembers = async () => {
  const uri = `${API_HOST}/members`;
  const [err, res] = await to(axios.get(uri));
  if (err) {
    return [err, null];
  }
  if (res.status === 200) {
    return [null, res.data];
  }
  return ['Error calling getAllMembers', null];
};

export const postAttendance = async id => {
  const uri = `${API_HOST}/attendance`;
  const [err, res] = await to(axios.post(uri, { id }));
  if (err) {
    return [err, null];
  }
  if (res.status === 200) {
    return [null, res.data];
  }
  return ['Error calling postAttendance', null];
};
