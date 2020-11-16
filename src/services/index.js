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

export function listCreate(data) {
  return api({
    url: '/checklist',
    method: 'POST',
    data
  });
}

export function listUpdate(data) {
  return api({
    url: `/checklist/${data.id}`,
    method: 'PUT',
    data
  });
}

export function listGetOne(listId) {
  return api({
    url: `/checklist/${listId}`,
    method: 'GET'
  });
}

export function itemGetAll(listId) {
  return api({
    url: `/item/checklist/${listId}`,
    method: 'GET'
  });
}

export function itemUpdate(data) {
  return api({
    url: `/item/${data.id}`,
    method: 'PUT',
    data
  });
}

export function itemCreate(data) {
  return api({
    url: '/item',
    method: 'POST',
    data
  });
}

export function itemGetOne(itemId) {
  return api({
    url: `/item/${itemId}`,
    method: 'GET'
  });
}

export function itemDelete(itemId) {
  return api({
    url: `/item/${itemId}`,
    method: 'DELETE'
  });
}
