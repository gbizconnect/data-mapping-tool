import { Module } from "@nestjs/common";
import { DataMappingController } from "./data-mapping.controller";
import { DataMappingService } from "./data-mapping.service";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [DataMappingController],
  providers: [DataMappingService, PrismaService],
})
export class DataMappingModule {}
