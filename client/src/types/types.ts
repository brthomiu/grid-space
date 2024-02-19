export type Location = {
  X: number;
  Y: number;
};

export type UnitStats = {
  Health: number;
  Attack: number;
  Defense: number;
};

export type Unit = {
  Id: string;
  Type: string;
  Name: string;
  Stats: UnitStats;
  Location: Location;
};

export type Tile = {
  Location: Location;
  Resource: Resource;
  Occupied: boolean;
  Unit: Unit | null;
};

export type Resource = {
  Type: string;
  Quantity: number;
  Quality: number;
};

export type LocationMessage = {
  Type: string;
  Payload: Tile[];
};

export type SyncMessage = {
  Type: string;
  Payload: ServerMessagePayload;
};

export type ServerMessagePayload = {
  Id: string;
  Location: Location;
  Stats: UnitStats;
  Message: string | null;
};

export type MoveMessage = {
  Type: string;
  Payload: MoveMessagePayload;
}

export type MoveMessagePayload = {
  Id: string,
  NextLocation: Location,
}