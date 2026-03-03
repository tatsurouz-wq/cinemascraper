/** 映画館チェーン */
export type Chain = "109cinemas" | "toho" | "tjoy" | "aeon";

/** 上映フォーマット */
export type ScreeningFormat =
  | "2D"
  | "IMAX"
  | "Dolby Atmos"
  | "4DX"
  | "ScreenX"
  | "MX4D";

/** 空席状況 */
export type Availability = "available" | "few_left" | "sold_out" | "unknown";

/** 劇場情報 */
export interface Theater {
  chain: Chain;
  name: string;
  area: string;
  prefecture: string;
  url?: string;
}

/** 個別上映回 */
export interface Screening {
  start_time: string;
  end_time: string;
  screen: string;
  format: ScreeningFormat;
  language: string;
  availability: Availability;
}

/** 映画情報 */
export interface Movie {
  title: string;
  duration_min: number | null;
  screenings: Screening[];
}

/** 1劇場・1日分のスケジュール */
export interface Schedule {
  theater: Theater;
  date: string;
  movies: Movie[];
  scraped_at: string;
}

/** エリア定義 */
export interface Area {
  id: string;
  name: string;
  prefecture: string;
  theaters: TheaterRef[];
}

/** 劇場参照（エリア内） */
export interface TheaterRef {
  chain: Chain;
  area: string;
  name: string;
}
