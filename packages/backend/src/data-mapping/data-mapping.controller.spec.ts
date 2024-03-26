import { Test, TestingModule } from "@nestjs/testing";
import { DataMappingController } from "./data-mapping.controller";

describe("DataMappingController", () => {
  let controller: DataMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataMappingController],
    }).compile();

    controller = module.get<DataMappingController>(DataMappingController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
