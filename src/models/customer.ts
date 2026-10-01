import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CustomerAttributes {
  id: string;
  userId: string;
  addressId?: string | null;
  paymentMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id' | 'addressId'> {}

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: string;
  public userId!: string;
  public addressId!: string | null;
  public paymentMethod!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    addressId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'addresses',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'CARD',
    },
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
  }
);
