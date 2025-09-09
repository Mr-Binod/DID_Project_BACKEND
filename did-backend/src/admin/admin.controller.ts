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
import * as bcrypt from 'bcrypt';

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
    _data.imgPath = `https://api.sealiumback.store/uploads/${file.filename}`;
    return this.adminService.savetempadmin(_data);
  }

  @Post('login')
  async login(@Body() _data : {userId : string, password : string}) {
	  const data = await this.adminService.findOne(_data.userId)
	  if(data.state !== 200 ) return {state : 403, message : '아이디가 일지하지 않습니다'}
	  const verifypwd = await bcrypt.compare(_data.password, data.data![0].password)
	  if(!verifypwd) return ({state : 403, message : '비밀번호가  일지하지 않습니다'})
	  return({state : 200, message : '로그인 성공했습니다', data})
  }

  @Get('superadmin')
  async GetsuperAdmin(){
	  const SuperAdminPwd = await bcrypt.hash('admin123@', 10)
	  return (SuperAdminPwd)
	 }

  @Get('admins')
  findAll() {
    return this.adminService.findAll();
  }
	
  @Get('pendingadmins')
  pendingAdmins() {
	  return this.adminService.pendingAdmins();
	 }

  @Delete('rejectadmin')
  rejectAdmin(@Body('userId') userId: string)  {
	  console.log(userId, 'rejectid')
	 return this.adminService.rejectAdmin(userId)
	} 


  @Get('getallvcinfo')
  gatAllVcInfo(){
	  return this.adminService.gatAllVcInfo()
	}

  @Get('rejectedadmins')
  getAllRejectedAdmins(){
	  return this.adminService.getAllRejectedAdmins()
  }

  @Get('getalladminstotalnum')
  getAllAdminsTotalNum(){
	  return this.adminService.getAllAdminsTotalNum()
	}
  @Get('gettotaluna')
  getTotalUnA() {
	  return this.adminService.getTotalUnA()
	 }

  @Get('vcrequestlogs')
  getVcRqeusts(){
	return this.adminService.getVcRequests()
  }
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
  @Get('availableid/:id')
  findavailableId(@Param('id') id: string) {
    return this.adminService.findavailableId(id)
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
