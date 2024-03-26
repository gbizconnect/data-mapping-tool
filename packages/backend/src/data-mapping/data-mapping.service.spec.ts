import { Test, TestingModule } from "@nestjs/testing";
import { DataMappingService } from "./data-mapping.service";

describe("DataMappingService", () => {
  let service: DataMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataMappingService],
    }).compile();

    service = module.get<DataMappingService>(DataMappingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
