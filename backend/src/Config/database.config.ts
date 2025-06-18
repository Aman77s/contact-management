import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseconfig : TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '12345',
  database: 'contact-management',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
}