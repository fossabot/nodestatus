import {
  getServerPassword,
  getListServers as _getListServers,
  addServer as _addServer,
  getServer,
  setServer as _setServer,
  delServer as _delServer
} from '../model/server';
import { compareSync } from 'bcryptjs';
import type { IServer, IResp, Box } from '../../types/server';
import { createRes } from '../lib/utils';

const validKeys = ['username', 'password', 'name', 'type', 'location', 'region', 'disabled'];

export async function authServer(username: string, password: string): Promise<boolean> {
  const result = await getServerPassword(username);
  if (result.code) return false;
  return compareSync(password, result.msg);
}

export async function addServer(obj: IServer): Promise<IResp> {
  validKeys.forEach(str => {
    if (!Object.prototype.hasOwnProperty.call(obj, str)) {
      return createRes(1, 'Check the details');
    }
  });

  if (Object.keys(obj).length !== 6) {
    return createRes(1, 'Check the details');
  }

  const result = await getServer(obj.username);
  if (!result.code) {
    return createRes(1, 'Username duplicate');
  }
  return _addServer(obj);
}

export async function setServer(username: string, obj: IServer): Promise<IResp> {
  const result = await getServer(username);
  if (result.code) return result;
  for (const str of Object.keys(obj)) {
    if (!validKeys.includes(str)) {
      return createRes(1, 'Check the details');
    }
  }
  return _setServer(username, obj);
}

export async function delServer(username: string): Promise<IResp> {
  const result = await getServer(username);
  if (result.code) {
    return result;
  }
  return _delServer(username);
}

export async function getListServers(): Promise<IResp> {
  const result = await _getListServers();
  if (result.code) return result;
  const obj: Box = {};

  (result.data as IServer[]).forEach(item => {
    if (item.disabled) return;
    const { username, ..._item } = item;
    obj[username] = _item;
  });
  return createRes({ data: obj });
}

export {
  _getListServers as getRawListServers
};


