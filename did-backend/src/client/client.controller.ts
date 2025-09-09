import { Controller,Req, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
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
import { CreateVcRequestDTO } from 'src/admin/dto/create-vc-request.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import type {  Request } from 'express';

@Controller('user')
export class ClientController {
  constructor(
    private readonly didService: DidService,
    private readonly clientService: ClientService,
    private readonly configService: ConfigService
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
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() _data: CreateClientDto
  ) {
     const jwtSecretKey: string = this.configService.get<string>('JWT_SECRET_KEY') as string;
    _data.imgPath = `https://api.sealiumback.store/uploads/${file.filename}`;
    const bcryptToken = await bcrypt.hash(_data.password, 10)
    _data.password = bcryptToken;
    console.log(_data, 'data');
    return this.didService.create(_data);
  }

  @Post('login')
  async findO(@Body() _data: {userid:string, password:string}) {
	const jwtSecretKey: string = this.configService.get<string>('JWT_SECRET_KEY') as string; 
  	const data = await this.clientService.findOne(_data.userid)
	console.log(data, 'adf')
	
	if(data.state !== 200) return data
	const result = await bcrypt.compare(_data.password, data.data![0].password)
	  console.log(result)
                if(result) return({state : 200, message : '로그인 성공'})
                return {state : 402, message : '아이디와 비밀번호를 일치하지 않습'}
   }

   @Get('oauth')
   async Oauth (
	@Req() req: Request ) {
		const jwtSecretKey: string = this.configService.get<string>('JWT_SECRET_KEY') as string;
		const loginAccessToken : string = req.cookies['login_access_token'];
		console.log(loginAccessToken, jwtSecretKey)
		const data = await jwt.verify(loginAccessToken, jwtSecretKey)
		console.log(data, 'tokendata')
		return data
	}

  @Post('vc/request')
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
  createVcRequest(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVcRequestDTO : CreateVcRequestDTO) {
	  console.log(createVcRequestDTO, ' createvc')
	  createVcRequestDTO.ImagePath = `https://api.sealiumback.store/uploads/${file.filename}`;
    return this.clientService.createVcRequest(createVcRequestDTO);
  }

  @Post('vc/confirm')
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
  
  @Get('loginstats')
  getUserLoginStats(){
	  return this.clientService.getUserLoginStats()
	  }

  @Post('loginstats')
  userLoginStats(@Body() id: string){
	  return this.clientService.userLoginStats(id)
	}
 
  @Get('pendingvc/:id')
  findUserPendingVc(@Param('id')){
	  return this.clientService.userLoginStats(id)
  }

  @Patch('rejectrevoke')
  certRevokeReject(@Body() userId : string, certName : string){
	  return this.clientService.certRevokeReject(userId, certName)
  }

    @Patch('approverevoke')
  certRevokeReject(@Body() userId : string, certName : string){
          return this.clientService.certApproveReject(userId, certName)
  }

    @Patch('rejectissue')
  certRevokeReject(@Body() userId : string, certName : string){
          return this.clientService.certRejectIssue(userId, certName)
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
