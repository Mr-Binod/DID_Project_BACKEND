import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { CreateDidDto } from 'src/did/dto/create-did.dto';
import { DidService } from 'src/did/did.service';
import { CreateVcDTO } from 'src/admin/dto/create-vc.dto';
import type { Express } from 'express';
import path from 'path';
@Controller('user')
export class ClientController {
  constructor(
    private readonly didService: DidService,
    private readonly clientService: ClientService
  ) {}

  @Post()
   @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
      const safeName = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      const parsed = path.parse(safeName);
      cb(null, `${parsed.name}_${Date.now()}${parsed.ext}`);
    },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() _data: CreateClientDto
  ) {
    _data.imgPath = `https://sealiumback.store/uploads/${file.filename}`;
    console.log(_data, 'data');
    return this.didService.create(_data);
  }

  @Post('vc')
  createvc(@Body() createVcDTO : CreateVcDTO) {
	  console.log(createVcDTO, ' createvc')
    return this.didService.createvc(createVcDTO);
  }

  @Get('vc/:id')
  findAllUserVc(@Param('id') id: string) {
    return this.clientService.findAllUserVc(id);
  }

  @Get('users')
  findAll() {
    return this.clientService.findAll();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id, 'id')
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }


  @Delete(':id/:vc')
  removevc(
    @Param('id') id: string,
    @Param('vc') vc: string
) {
    return this.clientService.removevc(id, vc);
  }
}
