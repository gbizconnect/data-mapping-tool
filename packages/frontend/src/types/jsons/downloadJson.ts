export interface DownloadJsonItem {
  source: string[];
  destination: string[];
  function: string[];
}

export interface DownloadJsonTypes {
  convert_rule: DownloadJsonItem[];
}
