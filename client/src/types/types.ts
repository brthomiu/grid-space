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
  Unit: string;
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
};

export type MoveMessagePayload = {
  Id: string;
  NextLocation: Location;
};

export type MoveMessageResponse = {
  Type: string;
  Payload: MoveResponsePayload;
};

export type MoveResponsePayload = {
  Tiles: [Tile];
  NextLocation: Location;
};

export type CharacterCreationMessage = {
  Type: string;
  Payload: CharacterCreationMessagePayload;
};

export type CharacterCreationMessagePayload = {
  Name: string;
};

export type CharacterCreationResponse = {
  Type: string;
  Payload: CharacterCreationResponsePayload;
};

export type CharacterCreationResponsePayload = {
  CharacterObject: Unit
};
