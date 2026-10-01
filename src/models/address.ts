import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AddressAttributes {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}

export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: string;
  public street!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public latitude?: number;
  public longitude?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Address.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'addresses',
    timestamps: true,
  }
);
