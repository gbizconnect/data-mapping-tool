import { IsNotEmpty, IsString, IsInt, IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/*
{
    "id": string,
    "file_name": string,
    "nodes": string,
    "edges": string,
    "register_time": string,
    "update_time": string,
    "version": number
}
*/

export class MappingDataDto {
  @ApiProperty({ description: "ID" })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: "File name" })
  @IsString()
  file_name: string;

  @ApiProperty({ description: "Nodes" })
  @IsString()
  nodes: string;

  @ApiProperty({ description: "Edges" })
  @IsString()
  edges: string;

  @ApiProperty({ description: "Register time" })
  @IsDate()
  register_time: Date;

  @ApiProperty({ description: "Update time" })
  @IsDate()
  update_time: Date;

  @ApiProperty({ description: "Version" })
  @IsInt()
  version: number;

  constructor(
    id: string,
    file_name: string,
    nodes: string,
    edges: string,
    register_time: Date,
    update_time: Date,
    version: number
  ) {
    this.id = id;
    this.file_name = file_name;
    this.nodes = nodes;
    this.edges = edges;
    this.register_time = register_time;
    this.update_time = update_time;
    this.version = version;
  }
}

/*
{
    "file_name": string,
    "nodes": string,
    "edges": string
}
*/
export class PostMappingDataDto {
  @ApiProperty({ description: "File name" })
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  file_name: string;

  @ApiProperty({ description: "Nodes" })
  @IsString()
  nodes: string;

  @ApiProperty({ description: "Edges" })
  @IsString()
  edges: string;

  @ApiProperty({ description: "Version" })
  @IsInt()
  version: number;

  @ApiProperty({ description: "Overwrite flag" })
  @IsInt()
  overWriteFlg: number;
}

/*
{
    "file_name": string,
    "nodes": string,
    "edges": string
}
*/
export class PutMappingDataDto {
  @ApiProperty({ description: "File name" })
  @IsString()
  file_name: string;

  @ApiProperty({ description: "Nodes" })
  @IsString()
  nodes: string;

  @ApiProperty({ description: "Edges" })
  @IsString()
  edges: string;

  @ApiProperty()
  @IsInt()
  version: number;

  constructor(
    file_name: string,
    nodes: string,
    edges: string,
    version: number
  ) {
    this.file_name = file_name;
    this.nodes = nodes;
    this.edges = edges;
    this.version = version;
  }
}
