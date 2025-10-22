import { Injectable } from '@nestjs/common';
import { and, eq, ilike, isNull, SQL, sql } from 'drizzle-orm';

import { NewUser, User, users } from '~infra/database/schema/users.schema';
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

  async getUserById(id: string): Promise<User | undefined> {
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

  async getUsersByFilter(filter: Partial<NewUser>) {
    const filters: SQL[] = [];

    if (filter.name) {
      filters.push(ilike(users.name, filter.name));
    }

    if (filter.email) {
      filters.push(eq(users.email, filter.email));
    }

    if (filter.active !== undefined) {
      filters.push(eq(users.active, filter.active));
    }

    const filteredUsers = await this.db
      .conn()
      .select()
      .from(users)
      .where(and(...filters));

    return filteredUsers;
  }

  async deleteUserById(id: string) {
    await this.db.conn().transaction(async (tx) => {
      await tx
        .update(users)
        .set({ deletedAt: sql`CURRENT_TIMESTAMP`, active: false })
        .where(
          and(
            eq(users.id, id),
            eq(users.active, true),
            isNull(users.deletedAt),
          ),
        );
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
