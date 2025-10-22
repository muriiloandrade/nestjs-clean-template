import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DB_KEY } from '~infra/config/db/constant';
import { User } from '~infra/database/schema/users.schema';
import { DbService } from '~infra/repositories/db/db.service';
import { UserRepository } from '~infra/repositories/user/user.service';
import { UserController } from '~interface/controllers/user/user.controller';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserFilterDTO,
} from '~interface/dtos/user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userRepository: UserRepository;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    deletedAt: null,
  };

  const mockUsers: User[] = [
    mockUser,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Jane Smith',
      email: 'jane@example.com',
      active: false,
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      deletedAt: null,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserRepository,
        DbService,
        { provide: DB_KEY, useValue: 'pg-test' },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    const testCases = [
      {
        description: 'should return all users when no filter is provided',
        filter: {},
        expectedResult: mockUsers,
        mockResult: mockUsers,
      },
      {
        description: 'should return filtered users by name',
        filter: { name: 'John' },
        expectedResult: [mockUser],
        mockResult: [mockUser],
      },
      {
        description: 'should return filtered users by email',
        filter: { email: 'john@example.com' },
        expectedResult: [mockUser],
        mockResult: [mockUser],
      },
      {
        description: 'should return filtered users by active status',
        filter: { active: true },
        expectedResult: [mockUser],
        mockResult: [mockUser],
      },
      {
        description: 'should return empty array when no users match filter',
        filter: { name: 'NonExistent' },
        expectedResult: [],
        mockResult: [],
      },
    ];

    it.each(testCases)(
      '$description',
      async ({ filter, expectedResult, mockResult }) => {
        // Arrange
        const getUsersByFilterSpy = jest
          .spyOn(userRepository, 'getUsersByFilter')
          .mockResolvedValue(mockResult);

        // Act
        const result = await controller.findAll(filter as UserFilterDTO);

        // Assert
        expect(result).toEqual(expectedResult);
        expect(getUsersByFilterSpy).toHaveBeenCalledWith(filter);
        expect(getUsersByFilterSpy).toHaveBeenCalledTimes(1);
      },
    );

    it('should handle repository errors', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      const getUsersByFilterSpy = jest
        .spyOn(userRepository, 'getUsersByFilter')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(controller.findAll({})).rejects.toThrow(errorMessage);
      expect(getUsersByFilterSpy).toHaveBeenCalledWith({});
      expect(getUsersByFilterSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return user when valid ID is provided', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const getUserByIdSpy = jest
        .spyOn(userRepository, 'getUserById')
        .mockResolvedValue(mockUser);

      // Act
      const result = await controller.findOne(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
      expect(getUserByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw http not found exception when user is not found', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174999';
      const getUserByIdSpy = jest
        .spyOn(userRepository, 'getUserById')
        .mockResolvedValue(undefined);

      // Act & Assert
      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
      expect(getUserByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const errorMessage = 'Database connection failed';
      const getUserByIdSpy = jest
        .spyOn(userRepository, 'getUserById')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(controller.findOne(userId)).rejects.toThrow(errorMessage);
      expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
      expect(getUserByIdSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    const validCreateUserData: CreateUserDTO = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const testCases = [
      {
        description: 'should create user successfully with valid data',
        userData: validCreateUserData,
        expectedResult: mockUser,
      },
      {
        description: 'should create user with different data',
        userData: {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        expectedResult: {
          ...mockUser,
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      },
    ];

    it.each(testCases)('$description', async ({ userData, expectedResult }) => {
      // Arrange
      const createUserSpy = jest
        .spyOn(userRepository, 'createUser')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(userData);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(createUserSpy).toHaveBeenCalledWith(userData);
      expect(createUserSpy).toHaveBeenCalledTimes(1);
    });

    const errorTestCases = [
      {
        description: 'should handle duplicate email error',
        userData: validCreateUserData,
        errorMessage: 'Email already exists',
      },
      {
        description: 'should handle database connection error',
        userData: validCreateUserData,
        errorMessage: 'Database connection failed',
      },
      {
        description: 'should handle validation error',
        userData: validCreateUserData,
        errorMessage: 'Invalid user data',
      },
    ];

    it.each(errorTestCases)(
      '$description',
      async ({ userData, errorMessage }) => {
        // Arrange
        const createUserSpy = jest
          .spyOn(userRepository, 'createUser')
          .mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(controller.create(userData)).rejects.toThrow(errorMessage);
        expect(createUserSpy).toHaveBeenCalledWith(userData);
        expect(createUserSpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('update', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const updateUserData: UpdateUserDTO = {
      name: 'John Updated',
      email: 'john.updated@example.com',
    };

    const updatedUser: User = {
      ...mockUser,
      name: 'John Updated',
      email: 'john.updated@example.com',
      updatedAt: '2023-01-02T00:00:00Z',
    };

    const testCases = [
      {
        description: 'should update user successfully with valid data',
        userId,
        userData: updateUserData,
        expectedResult: updatedUser,
      },
      {
        description: 'should update user with partial data',
        userId,
        userData: { name: 'Only Name Updated' },
        expectedResult: { ...mockUser, name: 'Only Name Updated' },
      },
      {
        description: 'should update user with empty object',
        userId,
        userData: {},
        expectedResult: mockUser,
      },
    ];

    it.each(testCases)(
      '$description',
      async ({ userId, userData, expectedResult }) => {
        // Arrange
        const updateUserSpy = jest
          .spyOn(userRepository, 'updateUser')
          .mockResolvedValue(expectedResult);

        // Act
        const result = await controller.update(userId, userData);

        // Assert
        expect(result).toEqual(expectedResult);
        expect(updateUserSpy).toHaveBeenCalledWith(userId, userData);
        expect(updateUserSpy).toHaveBeenCalledTimes(1);
      },
    );

    const errorTestCases = [
      {
        description: 'should handle user not found error',
        userId: '123e4567-e89b-12d3-a456-426614174999',
        userData: updateUserData,
        errorMessage: 'User not found',
      },
      {
        description: 'should handle duplicate email error',
        userId,
        userData: { email: 'existing@example.com' },
        errorMessage: 'Email already exists',
      },
      {
        description: 'should handle database connection error',
        userId,
        userData: updateUserData,
        errorMessage: 'Database connection failed',
      },
    ];

    it.each(errorTestCases)(
      '$description',
      async ({ userId, userData, errorMessage }) => {
        // Arrange
        const updateUserSpy = jest
          .spyOn(userRepository, 'updateUser')
          .mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(controller.update(userId, userData)).rejects.toThrow(
          errorMessage,
        );
        expect(updateUserSpy).toHaveBeenCalledWith(userId, userData);
        expect(updateUserSpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('delete', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const deleteSuccessMessage = {
      message: `User with id ${userId} deleted successfully.`,
    };

    const testCases = [
      {
        description: 'should delete user successfully',
        userId,
        expectedResult: deleteSuccessMessage,
      },
      {
        description: 'should delete different user successfully',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        expectedResult: {
          message:
            'User with id 123e4567-e89b-12d3-a456-426614174001 deleted successfully.',
        },
      },
    ];

    it.each(testCases)('$description', async ({ userId, expectedResult }) => {
      // Arrange
      const deleteUserByIdSpy = jest
        .spyOn(userRepository, 'deleteUserById')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await controller.delete(userId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(deleteUserByIdSpy).toHaveBeenCalledWith(userId);
      expect(deleteUserByIdSpy).toHaveBeenCalledTimes(1);
    });

    const errorTestCases = [
      {
        description: 'should handle user not found error',
        userId: '123e4567-e89b-12d3-a456-426614174999',
        errorMessage: 'User not found',
      },
      {
        description: 'should handle user already deleted error',
        userId,
        errorMessage: 'User already deleted',
      },
      {
        description: 'should handle database connection error',
        userId,
        errorMessage: 'Database connection failed',
      },
      {
        description: 'should handle inactive user deletion error',
        userId,
        errorMessage: 'Cannot delete inactive user',
      },
    ];

    it.each(errorTestCases)(
      '$description',
      async ({ userId, errorMessage }) => {
        // Arrange
        const deleteUserByIdSpy = jest
          .spyOn(userRepository, 'deleteUserById')
          .mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(controller.delete(userId)).rejects.toThrow(errorMessage);
        expect(deleteUserByIdSpy).toHaveBeenCalledWith(userId);
        expect(deleteUserByIdSpy).toHaveBeenCalledTimes(1);
      },
    );
  });
});
