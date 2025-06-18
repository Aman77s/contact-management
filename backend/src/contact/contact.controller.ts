import { Body, Controller, Get, Param, Post, Put, UseGuards, Request, Delete, Query, UseInterceptors, UploadedFile, Req, BadRequestException } from '@nestjs/common';
import { CreateContactDto } from './Dto/contact-create.dto';
import { ContactService } from './contact.service';
import { Contact } from './Entity/contact.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Contacts')
@ApiBearerAuth('access_token')
@UseGuards(AuthGuard('jwt'))
@Controller('contact')

export class ContactController {
    constructor(private contactService: ContactService){}

    @ApiQuery({ name: 'search', required: false, type: String }) 
    // @UseInterceptors(Recentsearchinterceptor) 
    @Get()
    getallcontact(@Request() req, @Query('search') search?: string ){
       
        return this.contactService.allContacts(req.user.userId, search)
    }

    @Post()
    create(@Body() createDto : CreateContactDto, @Request() req){
        return this.contactService.create(createDto, req.user.userId)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body:Partial<Contact>,@Request() req ){
        return this.contactService.update(id, body, req.user.userId )
    }

    @Get(':id')
    singleContact(@Param('id') id: number, @Request() req){
        return this.contactService.singleContact(id, req.user.userId)
    }

    @Delete(':id')
    deleteContact(@Param('id') id: number, @Request() req){
        return this.contactService.deleteContact(id, req.user.userId)
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async importContacts(@UploadedFile() file: Express.Multer.File, @Request() req){
        if(!file){
            throw new BadRequestException("No file uploaded")
        }
        
        return this.contactService.importcontact(file, req.user.userId)
    }
}
