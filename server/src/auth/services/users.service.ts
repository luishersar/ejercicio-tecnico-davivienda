import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async validateUser(email: string, password: string) {
    const u = await this.entityManager.findOne(User, {
      where: {
        email,
        password,
      },
    });

    return u ? { id: u.id, email: u.email, name: u.name } : null;
  }

  async findById(id: number) {
    const u = await this.entityManager.findOne(User, {
      where: {
        id: id.toString(),
      },
    });

    return u;
  }

  async validateExistingUser(email: string) {
    const u = await this.entityManager.findOne(User, {
      where: {
        email,
      },
    });

    return u ? { id: u.id, email: u.email, name: u.name } : null;
  }

  async createUser(email: string, password: string, name: string) {
    const user = this.entityManager.create(User, {
      email,
      password,
      name,
    });

    return this.entityManager.save(user);
  }
}
