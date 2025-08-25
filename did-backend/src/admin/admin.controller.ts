import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateVcDTO } from './dto/create-vc.dto';
import { DidService } from 'src/did/did.service';
import { CreateDidDto } from 'src/did/dto/create-did.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly didService: DidService,
    private readonly adminService: AdminService
  ) {}

  @Post()
  createadmin(@Body() _data: CreateDidDto) {
    return this.didService.createadmin(_data);
  }

  @Post('request')
  savetempadmin(@Body() _data: CreateAdminDto) {
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
