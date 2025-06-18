import { Contact} from "src/contact/Entity/contact.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column({ unique: true })
    email: string 

    @Column()
    password: string 

    @OneToMany(() => Contact, (contact) => contact.user)
    contacts: Contact[];
}