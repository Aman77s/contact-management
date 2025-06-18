import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './Entity/contact.entity';
import { User } from 'src/users/entity/users.entity';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports : [TypeOrmModule.forFeature([Contact, User]), 
  MulterModule.register({
    storage: memoryStorage()
  })
],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
