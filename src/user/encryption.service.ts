import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  constructor() {}

  public async generateHash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  public async compareHash(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
