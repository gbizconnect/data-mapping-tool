import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Validator } from "class-validator";
import {
  MappingDataDto,
  PostMappingDataDto,
  PutMappingDataDto,
} from "./data-mapping.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class DataMappingService {
  private validator: Validator;

  constructor(private readonly prisma: PrismaService) {
    this.validator = new Validator();
  }

  public async getMappingData(): Promise<MappingDataDto[]> {
    return await this.prisma.dataMapping
      .findMany({
        orderBy: {
          update_time: "desc",
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(
          `マッピングデータの取得に失敗しました。${e.message}`
        );
      })
      .finally(async () => {
        // close Prisma Client at the end
        await this.prisma.$disconnect();
      });
  }

  public async getMappingDataById(id: string): Promise<MappingDataDto | null> {
    console.log(id);
    return await this.prisma.dataMapping
      .findUnique({
        where: {
          id: id,
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(
          `マッピングデータの取得に失敗しました。${e.message}`
        );
      })
      .finally(async () => {
        // close Prisma Client at the end
        await this.prisma.$disconnect();
      });
  }

  public async postMappingData(
    postData: PostMappingDataDto
  ): Promise<MappingDataDto | null> {
    const id = uuidv4();
    const ts = new Date();
    const dto = new MappingDataDto(
      id,
      postData.file_name,
      JSON.stringify(postData.nodes),
      JSON.stringify(postData.edges),
      ts,
      ts,
      0
    );

    await this.prisma.dataMapping
      .create({
        data: dto,
      })
      .catch((e) => {
        throw new InternalServerErrorException(
          `マッピングデータの登録に失敗しました。${e.message}`
        );
      })
      .finally(async () => {
        // close Prisma Client at the end
        await this.prisma.$disconnect();
      });

    return this.getMappingDataById(id);
  }

  public async putMappingData(id: string, putData: PutMappingDataDto) {
    const existDto = await this.getMappingDataById(id);
    if (existDto === null) {
      return;
    }

    const ts = new Date();
    const dto = new MappingDataDto(
      id,
      putData.file_name,
      JSON.stringify(putData.nodes),
      JSON.stringify(putData.edges),
      ts,
      ts,
      Number(putData.version) + 1
    );
    await this.prisma.dataMapping
      .update({
        data: dto,
        where: {
          id,
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(
          `マッピングデータの更新に失敗しました。${e.message}`
        );
      })
      .finally(async () => {
        // close Prisma Client at the end
        await this.prisma.$disconnect();
      });

    return this.getMappingDataById(id);
  }

  public async deleteMappingData(id: string) {
    await this.prisma.dataMapping
      .delete({
        where: {
          id: id,
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(
          `マッピングデータの削除に失敗しました。${e.message}`
        );
      })
      .finally(async () => {
        // close Prisma Client at the end
        await this.prisma.$disconnect();
      });

    return {
      code: "200",
      message: "delete succeeded.",
    };
  }
}
