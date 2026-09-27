'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const driverUserId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const customerUserId = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
    const addressId = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

    await queryInterface.bulkInsert('users', [
      {
        id: driverUserId,
        username: 'driver_john',
        password: hashedPassword,
        role: 'driver',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: customerUserId,
        username: 'customer_alice',
        password: hashedPassword,
        role: 'customer',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await queryInterface.bulkInsert('addresses', [
      {
        id: addressId,
        street: '123 Tech Park Rd',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        latitude: 37.774929,
        longitude: -122.419418,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await queryInterface.bulkInsert('drivers', [
      {
        id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        userId: driverUserId,
        status: 'AVAILABLE',
        vehicleNo: 'CA-FLUX-888',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await queryInterface.bulkInsert('customers', [
      {
        id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        userId: customerUserId,
        addressId: addressId,
        paymentMethod: 'CREDIT_CARD',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
    await queryInterface.bulkDelete('drivers', null, {});
    await queryInterface.bulkDelete('addresses', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
