export interface IJwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface Dictionary<TItem> {
  [key: string]: TItem;
}
