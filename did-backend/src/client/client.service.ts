import { Inject, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';
import { DidService } from 'src/did/did.service';

@Injectable()
export class ClientService {
  constructor(
    private didService: DidService,
    @Inject('DATABASE') private db: NodePgDatabase<typeof schema>,
  ) {}

  create(
    createClientDto: CreateClientDto
  ) {
    return 'This action adds a new client';
  }

  async findAllUserVc(id : string) {
    // let uservc = []
    const data = await this.db.select().from(schema.UserVC).where(eq(schema.UserVC.userId, id))
    console.log(data, 'data')
    const VCdata = data.map(async (item) => {
      const VC = await this.didService.getVC(item.userDidId, item.certificateName)
      return VC
    })
    console.log(VCdata, 'vcdata')
    return VCdata;
  }

  async findAll() {
    const data = await this.db.select().from(schema.user)
    console.log(data, 'data')
    return data;
  }

  async findOne(id: string) {
    console.log(id, 'id')
    const data = await this.db.select().from(schema.user).where(eq(schema.user.userId, id))
    console.log(data, 'data')
    return data;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }
  
  async remove(id: string) {
    await this.db.delete(schema.user).where(eq(schema.user.userId, id));
    return {state : 200, message : 'user deleted'};
  }

  removevc(id: string, vc: string) {
    return this.didService.removeVc(id, vc);
  }
}
