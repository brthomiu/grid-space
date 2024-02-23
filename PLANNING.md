Server Architecture ->

Persistent gamestate lives in a SQL database.

Gamestate is described by a grid made of tiles, each tile contains a location value.

Tiles may contain a unit, can be a character or npc.

Units have a location value