package types

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

type PlayerLocationPayload struct {
	PlayerId string
	Location Location
}

type Message struct {
	Type    string
	Payload PlayerLocationPayload
}

type Response struct {
	Type    string
	Payload []Tile
}
