export interface MappingDataJsonBase {
  id?: string;
  file_name: string;
  nodes: string;
  edges: string;
  register_time?: string;
  update_time?: string;
  version?: number;
}

export interface MappingDataJsonGet extends MappingDataJsonBase {
  id: string;
  register_time: string;
  update_time: string;
  version: number;
}

export interface MappingDataJsonSessionValid {
  sessionValid: boolean;
}

export interface MappingDataJsonGetList extends MappingDataJsonSessionValid {
  data: MappingDataJsonGet[];
}
