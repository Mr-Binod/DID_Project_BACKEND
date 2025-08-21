import { Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateVcDTO } from './dto/create-vc.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {

  private jwtSecretKey : string;

  constructor(
    private configService: ConfigService,
    @Inject('DATABASE') private db: NodePgDatabase<typeof schema>,
  ){ 
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY') as string;
  }

  createvc(createVcDTO: CreateVcDTO) {
    const userdata = this.db.select().from(schema.user).where(eq(schema.user.userId, createVcDTO.userId));
    const issuerdata = this.db.select().from(schema.user).where(eq(schema.admin.adminId, createVcDTO.issuerId));

    console.log(userdata, issuerdata, 'userdata');

    // const userdidAddress = 
    // const userdid = 
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
