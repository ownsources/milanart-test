import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionService {
    constructor(private readonly configService: ConfigService) {}

    public async generateHash(data: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(data, salt);
    }

    public async compareHash(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}
