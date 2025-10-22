import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DbSchema } from '~infra/database/schema';
import { NewUser, users } from '~infra/database/schema/users.schema';

@Injectable()
export class UserService {
  constructor(@Inject('pg') private readonly db: NodePgDatabase<DbSchema>) {}

  async createUser(newUser: NewUser) {
    const [user] = await this.db.transaction(async (tx) => {
      return await tx.insert(users).values(newUser).returning();
    });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user[0];
  }

  async getAllUsers() {
    const allUsers = await this.db.select().from(users);
    return allUsers;
  }

  async deleteUserById(id: string) {
    await this.db.transaction(async (tx) => {
      await tx.delete(users).where(eq(users.id, id));
    });
    return { message: `User with id ${id} deleted successfully.` };
  }

  async updateUserName(id: string, newValues: Partial<NewUser>) {
    const [updatedUser] = await this.db.transaction(async (tx) => {
      return await tx
        .update(users)
        .set(newValues)
        .where(eq(users.id, id))
        .returning();
    });
    return updatedUser;
  }
}
