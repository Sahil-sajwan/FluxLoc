import { sequelize } from '../config/database';
import { User, UserRole } from './user';
import { Driver, DriverStatus } from './driver';
import { Customer } from './customer';
import { Address } from './address';

// Associations

// User <-> Driver (One-to-One)
User.hasOne(Driver, { foreignKey: 'userId', as: 'driverProfile' });
Driver.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Customer (One-to-One)
User.hasOne(Customer, { foreignKey: 'userId', as: 'customerProfile' });
Customer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Customer <-> Address (Belongs-to)
Address.hasMany(Customer, { foreignKey: 'addressId', as: 'customers' });
Customer.belongsTo(Address, { foreignKey: 'addressId', as: 'address' });

export {
  sequelize,
  User,
  UserRole,
  Driver,
  DriverStatus,
  Customer,
  Address,
};
