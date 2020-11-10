import api from './api';

export function userGetOne(userId) {
  return api({
    url: `/user/${userId}`,
    method: 'GET'
  });
}

export function userCreate(data) {
  return api({
    url: `/user`,
    method: 'POST',
    data
  });
}

export function listGetAll(userId) {
  return api({
    url: `/checklist/user/${userId}`,
    method: 'GET'
  });
}
