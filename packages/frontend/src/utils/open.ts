import {
  MappingDataJsonGet,
  MappingDataJsonGetList,
  MappingDataJsonSessionValid,
} from "@types";
import { crud } from "@utils";

export const openExisting = async (
  id: string
): Promise<MappingDataJsonGet & MappingDataJsonSessionValid> => {
  const response: Response = await crud({ url: `/${id}` });

  return response.status >= 200 && response.status < 300
    ? response.json()
    : Promise.reject(response.status);
};

export const getList = async (): Promise<
  MappingDataJsonGetList & MappingDataJsonSessionValid
> => {
  const response: Response = await crud({});

  return response.status >= 200 && response.status < 300
    ? response.json()
    : Promise.reject(response.status);
};
