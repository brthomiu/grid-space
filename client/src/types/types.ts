export type Grid = {
    size: number;
}

export type Location = {
  x: number;
  y: number;
};

export type UnitStats = {
  health: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
};

export type Unit = {
  type: string;
  name: string;
  stats: UnitStats;
};

export type Tile = {
  location: Location;
  resource: Resource;
  occupied: boolean;
};

export type Resource = {
  type: string;
  quantity: number;
  quality: number;
};
