import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './Dto/contact-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './Entity/contact.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { Readable } from 'stream';
import {parse } from 'csv-parse'
@Injectable()
export class ContactService {
    constructor(@InjectRepository(Contact) private useContacts: Repository<Contact>,
    @InjectRepository(User) private usersRepository: Repository<User>    
){}



// Function for Create a New Record and set Login user 

async create(createDto: CreateContactDto, userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

 

    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const contactDetails = this.useContacts.create({
        ...createDto,
        user,
    });

    await this.useContacts.save(contactDetails);

    return 'Contact Created Successfully';
}


// Handle Search Or Fetch All Records From Database

async allContacts(userId: number, search?: string) {
  return this.useContacts.find({
    where: search
      ? [
          { user: { id: userId }, name: ILike(`%${search}%`) },
          { user: { id: userId }, email: ILike(`%${search}%`) },
          { user: { id: userId }, phone: ILike(`%${search}%`) },
        ]
      : { user: { id: userId } },
    order: { id: 'DESC' },
  });
}
      


// Function for update exisitng records 

    async update(id: number, data: Partial<Contact>, userId: number){
        const contact = await this.useContacts.findOne({where: {id, user:{id: userId} }});
        if(!contact){
            throw new NotFoundException("Contact not found or not owned by user")
        }

        await this.useContacts.update(id, data)


        return "Contact Data Update Scuessfully"
    }

// Get One Specific Record from Database using Id 

    async singleContact(id: number, userId: number){
        const contact=  await this.useContacts.findOne({where: {id, user: {id: userId}}})
        if(!contact){
            throw new NotFoundException("Not Found this records or not owned by this user")
        }

        return contact
    }

// Delete Record usign Id

    async deleteContact(id:number, userId: number){
        const contact = await this.useContacts.findOne({where: {id, user:{id: userId}}})

        if(!contact){
            throw new NotFoundException("This Contact not exist or not owned by you")
        }

        this.useContacts.delete(id)

        return "Contact Delete Sccuessfully"
    }

    async importcontact(file : Express.Multer.File, userId : number){
        const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if(!file || !file.buffer){
        console.log('File details:', file);
        throw new NotFoundException("CSV file is missing or invalid'")
    }

        const stream = Readable.from(file.buffer);
        const parser = stream.pipe(
        parse(
            {
                columns: true,
                trim: true,
                skip_empty_lines: true
    }

        ),
          ); 

        const contact: Partial<Contact>[] = []
    try{
        for await (const record of parser){
            if (!record.name || !record.email || !record.phone) {
                console.log('Service - Invalid row skipped:', record);
                continue;
                }

            const {name , email, phone, address , ...rest } = record
                
            contact.push({
                name, email, phone, address, extra_fields: rest, user
            })
        }
    } catch(error){
        throw new BadRequestException("Faild to parse csv ")
    }
        if(contact.length === 0){
            throw new BadRequestException("No Contacts Found in File ")
        }

        await this.useContacts.save(contact)

        return "Contact Saved Successfully"
    }

//      async importcontact(file: Express.Multer.File, userId: number) {
//     // 1) ensure user exists
//     const user = await this.usersRepository.findOne({ where: { id: userId } });
//     if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

//     // 2) ensure file was uploaded
//     if (!file) throw new NotFoundException('No file provided');
//     if (!file.buffer) throw new BadRequestException('File buffer is missing – use memoryStorage.');

//     const records: Partial<Contact>[] = [];
//     const parser = parse({
//       columns: true,
//       trim: true,
//       skip_empty_lines: true,
//     });

//     // 3) pipe the buffer into the parser
//     const stream = Readable.from(file.buffer).pipe(parser);

//     try {
//       for await (const row of stream) {
//         // 4) skip invalid rows
//         if (!row.name || !row.email || !row.phone) {
//           console.warn('Skipping invalid row:', row);
//           continue;
//         }
//         records.push({
//           name: row.name,
//           email: row.email,
//           phone: row.phone,
//           address: row.address ?? '',
//           user,
//         });
//       }
//     } catch (err) {
//       console.error('CSV parse error:', err);
//       throw new BadRequestException('Failed to parse CSV: ' + err.message);
//     }

//     if (records.length === 0) {
//       throw new BadRequestException('No valid contacts found in file');
//     }

//     // 5) save all at once
//     return this.useContacts.save(records);
//   }
}
