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
	Health   int
	Attack   int
	Defense  int
	Movement int
	Range    int
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
	Occupied bool
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
	Id           string
	NextLocation Location
}

type Response struct {
	Type    string
	Payload []Tile
}
