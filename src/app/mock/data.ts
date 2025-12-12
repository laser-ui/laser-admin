import avatarUrl from '../../assets/avatar.png';
import { ROLE_ACL, ROUTES_ACL } from '../configs/acl';

export const DATA = {
  admin: {
    id: 1,
    name: 'admin',
    permissions: [ROLE_ACL.super_admin],
  } as AppDocs.User,
  user: {
    id: 2,
    name: 'user',
    avatar: { id: 1, name: 'avatar', path: avatarUrl },
    permissions: [0, ROUTES_ACL['/test/acl'], ROUTES_ACL['/test/http']],
  } as AppDocs.User,
  notifications: [
    Array.from({ length: 4 }).map((_, i) => ({ message: `This is message ${i}`, read: i === 1 })),
    Array.from({ length: 2 }).map((_, i) => ({ message: `This is message ${i}`, read: false })),
    [],
  ],
  devices: Array.from({ length: 108 }).map<AppDocs.Device>((_, i) => ({
    id: i,
    create_time: Date.now() + 60 * 60 * 1000,
    update_time: Date.now() + 60 * 60 * 1000,
    name: `Device ${i}`,
    model: `Model ${~~(Math.random() * 9) % 3}`,
    price: ~~(Math.random() * 1000),
    status: ~~(Math.random() * 9) % 3,
  })),
  deviceModels: Array.from({ length: 4 }).map((_, index) => ({
    name: `Model ${index}`,
    disabled: index === 3,
  })),
};
