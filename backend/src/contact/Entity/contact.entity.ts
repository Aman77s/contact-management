import { User } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contact{

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name: string

    @Column()
    email: string;

    @Column({type: 'varchar'})
    phone: string;

    @Column()
    address: string

    @Column('jsonb', {nullable: true})
    extra_fields: Record<string, any>

    @ManyToOne(() => User, (user) => user.contacts, { nullable: false })
    user: User;

}