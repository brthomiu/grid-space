export type Grid = {
    size: number;
}

export type Location = {
  X: number;
  Y: number;
};

export type UnitStats = {
  health: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
};

export type Unit = {
  id: string;
  type: string;
  name: string;
  stats: UnitStats;
};

export type Tile = {
  Location: Location;
  Resource: Resource;
  Occupied: boolean;
};

export type Resource = {
  Type: string;
  Quantity: number;
  Quality: number;
};
