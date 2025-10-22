import { PartialType, PickType } from '@nestjs/swagger';

export class UserDTO {
  id: string;

  name: string;

  email: string;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}

export class CreateUserDTO extends PickType(UserDTO, [
  'name',
  'email',
] as const) {}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class UserFilterDTO extends PickType(PartialType(UserDTO), [
  'name',
  'email',
  'active',
] as const) {}
