import api from './api';

export function userGetOne(userId) {
  return api({
    url: `/user/${userId}`,
    method: 'GET'
  });
}
