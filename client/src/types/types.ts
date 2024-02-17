export type Location = {
  X: number;
  Y: number;
};

export type UnitStats = {
  Health: number;
  Attack: number;
  Defense: number;
  Movement: number;
  Range: number;
};

export type Unit = {
  Id: string;
  Type: string;
  Name: string;
  Stats: UnitStats;
  Location: Location
};

export type Tile = {
  Location: Location;
  Resource: Resource;
  Occupied: boolean;
  Unit: Unit;
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