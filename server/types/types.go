package types

import (
	"encoding/json"
)

type Grid struct {
	Size int
}

type Location struct {
	X, Y int
}

type UnitStats struct {
	Health  int
	Attack  int
	Defense int
}

type Unit struct {
	Id    string
	Type  string
	Name  string
	Stats UnitStats
}

type Tile struct {
	Location Location
	Resource Resource
	Unit     string
}

type Resource struct {
	Type     string
	Quantity int
	Quality  int
}

type Message struct {
	Type    string
	Payload json.RawMessage
}

type GetPlayerMapMessage struct {
	PlayerId string
	Location Location
}

type MoveMessage struct {
	Id        string
	Direction string
}

type MoveMessagePayload struct {
	Tiles        []Tile
	NextLocation Location
}

type MoveMessageResponse struct {
	Type    string
	Payload MoveMessagePayload
}

type Response struct {
	Type    string
	Payload []Tile
}

type CharacterCreationMessage struct {
	Type    string
	Payload CharacterCreationMessagePayload
}

type CharacterCreationMessagePayload struct {
	Name string
}

type CharacterCreationObject struct {
	UnitObj  Unit
	Location Location
}

type CharacterCreationResponse struct {
	Type    string
	Payload CharacterCreationResponsePayload
}

type CharacterCreationResponsePayload struct {
	CharacterObject Unit
	Location        Location
}

type SyncMessage struct {
	Type    string
	Payload SyncMessagePayload
}

type SyncMessagePayload struct {
	Tiles []Tile
}
