import { Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateVcDTO } from './dto/create-vc.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { Admin } from 'typeorm';
import { AdminRequestDto } from './dto/admin-request.dto';

@Injectable()
export class AdminService {

  private jwtSecretKey : string;

  constructor(
    private configService: ConfigService,
    @Inject('DATABASE') private db: NodePgDatabase<typeof schema>,
  ){ 
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY') as string;
  }

  // createvc(createVcDTO: CreateVcDTO) {
  //   const userdata = this.db.select().from(schema.user).where(eq(schema.user.userId, createVcDTO.userId));
  //   const issuerdata = this.db.select().from(schema.user).where(eq(schema.admin.adminId, createVcDTO.issuerId));

  //   console.log(userdata, issuerdata, 'userdata');

  //   // const userdidAddress = 
  //   // const userdid = 
  //   return 'This action adds a new admin';
  // }

  async savetempadmin(adminRequestDto : AdminRequestDto){ 
      // const {userId, userName, nickName, password, birthDate, phoneNumber, grade, imgPath } = adminRequestDto
      const data = await this.db.insert(schema.adminRequest).values(adminRequestDto).returning();
      return {state : 200, message : 'admin request saved', data};
    }

  findAll() {
    const alladmins = this.db.select().from(schema.admin)
    console.log(alladmins, 'alladmins');
    return alladmins;
  }

  findOne(id: string) {
    const admin = this.db.select().from(schema.admin).where(eq(schema.admin.userId, id));
    console.log(admin, 'adminfindone');
    return admin;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: string) {
    const admin = this.db.delete(schema.admin).where(eq(schema.admin.userId, id));
    console.log(admin, 'admindeleted');
    return {state : 200, message : 'admin deleted'};
  }
}
