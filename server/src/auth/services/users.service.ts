import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, email: 'demo@example.com', password: 'secret123', name: 'Demo' },
  ];

  validateUser(email: string, password: string) {
    const u = this.users.find(
      (x) => x.email === email && x.password === password,
    );
    return u ? { id: u.id, email: u.email, name: u.name } : null;
  }

  findById(id: number) {
    return this.users.find((u) => u.id === id) ?? null;
  }
}
