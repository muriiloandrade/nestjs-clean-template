import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { UserRepository } from '~infra/repositories/user/user.service';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserDTO,
} from '~interface/dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userRepo: UserRepository) {}

  @ApiOkResponse({
    description: 'User found successfully.',
    type: UserDTO,
    isArray: true,
  })
  @Get('')
  async findAll() {
    return await this.userRepo.getAllUsers();
  }

  @ApiOkResponse({ description: 'User found successfully.', type: UserDTO })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userRepo.getUserById(id);
  }

  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: UserDTO,
  })
  @Post('')
  async create(@Body() userData: CreateUserDTO) {
    return await this.userRepo.createUser(userData);
  }

  @ApiOkResponse({ description: 'User updated successfully.', type: UserDTO })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() userData: UpdateUserDTO) {
    return await this.userRepo.updateUser(id, userData);
  }

  @ApiOkResponse({ description: 'User deleted successfully.', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userRepo.deleteUserById(id);
  }
}
