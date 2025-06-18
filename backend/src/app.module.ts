import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseconfig } from './Config/database.config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [UsersModule, ContactModule, TypeOrmModule.forRoot(databaseconfig), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
