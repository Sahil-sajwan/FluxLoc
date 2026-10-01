import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum DriverStatus {
  OFFLINE = 'OFFLINE',
  AVAILABLE = 'AVAILABLE',
  ACCEPTED = 'ACCEPTED',
  EN_ROUTE = 'EN_ROUTE',
  ARRIVED = 'ARRIVED',
  IN_RIDE = 'IN_RIDE',
}

export interface DriverAttributes {
  id: string;
  userId: string;
  status: DriverStatus;
  vehicleNo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DriverCreationAttributes extends Optional<DriverAttributes, 'id' | 'status'> {}

export class Driver extends Model<DriverAttributes, DriverCreationAttributes> implements DriverAttributes {
  public id!: string;
  public userId!: string;
  public status!: DriverStatus;
  public vehicleNo!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Driver.init(
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
    status: {
      type: DataTypes.ENUM(...Object.values(DriverStatus)),
      defaultValue: DriverStatus.OFFLINE,
      allowNull: false,
    },
    vehicleNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'drivers',
    timestamps: true,
  }
);
