import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { NewUser, users } from '~infra/database/schema/users.schema';
import { DbService } from '~infra/repositories/db/db.service';

@Injectable()
export class UserRepository {
  constructor(private readonly db: DbService) {}

  async createUser(newUser: NewUser) {
    const [user] = await this.db.conn().transaction(async (tx) => {
      return await tx.insert(users).values(newUser).returning();
    });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.db
      .conn()
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user[0];
  }

  async getAllUsers() {
    const allUsers = await this.db.conn().select().from(users);
    return allUsers;
  }

  async deleteUserById(id: string) {
    await this.db.conn().transaction(async (tx) => {
      await tx.delete(users).where(eq(users.id, id));
    });
    return { message: `User with id ${id} deleted successfully.` };
  }

  async updateUser(id: string, newValues: Partial<NewUser>) {
    const [updatedUser] = await this.db.conn().transaction(async (tx) => {
      return await tx
        .update(users)
        .set(newValues)
        .where(eq(users.id, id))
        .returning();
    });
    return updatedUser;
  }
}
