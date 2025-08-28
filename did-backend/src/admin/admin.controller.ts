import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateVcDTO } from './dto/create-vc.dto';
import { DidService } from 'src/did/did.service';
import { CreateDidDto } from 'src/did/dto/create-did.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly didService: DidService,
    private readonly adminService: AdminService
  ) {}

  @Post()
  createadmin(@Body() _data: CreateAdminDto) {
    console.log(_data, 'dataadmin');
    return this.didService.createadmin(_data);
  }

  @Post('request')
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
  savetempadmin(
    @UploadedFile() file: Express.Multer.File,
    @Body() _data: CreateAdminDto
  ) {
    _data.imgPath = `https://sealiumback.store/uploads/${file.filename}`;
    return this.adminService.savetempadmin(_data);
  }

  @Get('admins')
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
