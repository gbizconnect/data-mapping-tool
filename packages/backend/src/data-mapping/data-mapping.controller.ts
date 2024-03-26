/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  UseFilters,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { HttpExceptionFilter } from "../common/exception/exception.filter";
import {
  MappingDataDto,
  PostMappingDataDto,
  PutMappingDataDto,
} from "./data-mapping.dto";
import { DataMappingService } from "./data-mapping.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@Controller("/api/v1/mapping-data")
@ApiTags("DataMapping")
export class DataMappingController {
  constructor(private readonly dataMappingService: DataMappingService) {}

  @Get("")
  @ApiOperation({ summary: "Get DataMapping list." })
  @UseFilters(HttpExceptionFilter)
  async getMappingData(@Res() res: Response): Promise<Response> {
    // 開始ログを出力する
    console.log("start getMappingData");

    // 全部データマッピングデータ（更新日時降順）を取得する
    const dataMappingList = await this.dataMappingService
      .getMappingData()
      .catch((e) => {
        console.log(e);
        return res.status(HttpStatus.EXPECTATION_FAILED).json([]);
      });

    const mappingDataJson = {
      data: dataMappingList,
      sessionValid: true,
    };

    // 終了ログを出力する
    console.log("finish getMappingData");

    // 全部データマッピングデータ（更新日時降順）を返却する
    return res.status(HttpStatus.OK).json(mappingDataJson);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Get existing DataMapping." })
  @UseFilters(HttpExceptionFilter)
  async getMappingDataById(
    @Param("id") id: string,
    @Res() res: Response
  ): Promise<Response> {
    // 開始ログを出力する
    console.log("start getMappingDataById");
    if (id.trim() === "") {
      return res.status(HttpStatus.BAD_REQUEST).json([]);
    }

    const mappingData = await this.dataMappingService
      .getMappingDataById(id)
      .catch((e) => {
        return res.status(HttpStatus.EXPECTATION_FAILED).json([]);
      });

    // 終了ログを出力する
    console.log("finish getMappingDataById");

    if (mappingData === null) {
      return res.status(HttpStatus.NOT_FOUND).json(mappingData);
    }

    return res.status(HttpStatus.OK).json(mappingData);
  }

  @Post("")
  @ApiOperation({ summary: "Save new DataMapping." })
  @UseFilters(HttpExceptionFilter)
  async postMappingData(
    @Body() postMappingDataDto: PostMappingDataDto,
    @Res() res: Response
  ): Promise<Response> {
    // 開始ログを出力する
    console.log("start post");

    let returnFlg: boolean = false;
    let existVersion: number = 0;
    let existId: string = "";

    try {
      // 上書き保存ではない場合
      if (postMappingDataDto.overWriteFlg === 0) {
        (await this.dataMappingService.getMappingData()).forEach((temp) => {
          // ファイル名の重複があるかどうかチェックする
          if (temp.file_name.match(postMappingDataDto.file_name)) {
            existVersion = temp.version;
            existId = temp.id;
            returnFlg = true;
            return;
          }
        });
      } else {
        // 上書き保存の場合、データマッピングを上書き保存する
        const dataMapping = await this.dataMappingService.putMappingData(
          postMappingDataDto.id,
          new PutMappingDataDto(
            postMappingDataDto.file_name,
            postMappingDataDto.nodes,
            postMappingDataDto.edges,
            postMappingDataDto.version
          )
        );

        // 終了ログを出力する
        console.log("finish post");

        // 上書き保存結果を返却し、処理を終了する
        return res.status(HttpStatus.OK).json(dataMapping);
      }
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.EXPECTATION_FAILED).json([]);
    }

    // ファイル名の重複がある場合、リターンする
    if (returnFlg) {
      // 終了ログを出力する
      console.log("finish post");

      // 重複情報を返却し、処理を終了する
      const dataMapping = new MappingDataDto(
        existId,
        null,
        null,
        null,
        null,
        null,
        existVersion
      );
      return res.status(HttpStatus.OK).json(dataMapping);
    }

    // ファイル名の重複がない、名前を付けて保存する
    const dataMapping = await this.dataMappingService
      .postMappingData(postMappingDataDto)
      .catch((e) => {
        return res.status(HttpStatus.EXPECTATION_FAILED).json([]);
      });

    // 終了ログを出力する
    console.log("finish post");

    // 名前を付けて保存結果を返却し、処理を終了する
    return res.status(HttpStatus.OK).json(dataMapping);
  }

  @Put("/:id")
  @ApiOperation({ summary: "Modify existing DataMapping." })
  @UseFilters(HttpExceptionFilter)
  async putMappingData(
    @Param("id") id: string,
    @Body() putMappingDataDto: PutMappingDataDto,
    @Res() res: Response
  ): Promise<Response> {
    // 開始ログを出力する
    console.log("start put");

    // IDの空白チェック
    if (id.trim() === "") {
      return res.status(HttpStatus.BAD_REQUEST).json([]);
    }

    // 改修データマッピングファイルを検索する
    const existDto = await this.dataMappingService
      .getMappingDataById(id)
      .catch((e) => {
        return res.status(HttpStatus.EXPECTATION_FAILED).json([]);
      });

    if (existDto === null) {
      // 終了ログを出力する
      console.log("finish put");
      return res.status(HttpStatus.NOT_FOUND).json([]);
    }

    // データマッピングを上書き保存する
    const dataMapping = await this.dataMappingService
      .putMappingData(id, putMappingDataDto)
      .catch((e) => {
        return res.status(HttpStatus.EXPECTATION_FAILED).json([]);
      });

    // 終了ログを出力する
    console.log("finish put");

    // 上書き保存結果を返却し、処理を終了する
    return res.status(HttpStatus.OK).json(dataMapping);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "Delete existing DataMapping." })
  @UseFilters(HttpExceptionFilter)
  async deleteMappingData(
    @Param("id") id: string,
    @Res() res: Response
  ): Promise<Response> {
    // 開始ログを出力する
    console.log("start delete");

    if (id.trim() === "") {
      return res.status(HttpStatus.BAD_REQUEST).json([]);
    }

    await this.dataMappingService.deleteMappingData(id).catch((e) => {
      return res.status(HttpStatus.EXPECTATION_FAILED).json([]);
    });

    return res.status(HttpStatus.OK).json([]);

    // 終了ログを出力する
    console.log("finish delete");
  }
}
