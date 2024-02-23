# SHORTLIST

Remove characters from grid when connection is closed.

    -> null location from grid and character SQL tables
    -> when player logs in with same name, generate a new random location for player to spawn

Handle location collisions.

    -> check if a tile is occupied and don't let players move into an occupied tile

Server tick rate + handle requests in batches

    -> see longlist for more detail
        -> this needs to be done before fixing how the client renders

Fix the way the frontend renders.

    -> Rerender should be triggered by global ticks from the server


# LONGLIST

# Limit Server Requests

The client requests the game map every time the player moves.

## Proposal:

Request the game map from the server right before the player reaches the edge of the current game map instead of every time the player moves.

## Result:

This will reduce the number of server requests by a factor equivalent to the map size. It will also change the way the map scrolls with the current client-side map pagination logic - this could potentially be good or bad.


# Establish a global tick-rate on server

The server needs a global tick rate.

## Proposal:

Establish a 1 second global tick on the server - messages from clients should pool asynchronously, execute functions on each tick, and send responses back to clients. Will need some panic handling and will need to figure out some type of client-side prediction or rollback mechanism to keep states in sync.

## Result:

This will make concurrent multiplayer possible by keeping all of the clients' gamestates in sync with the server.


<!-- # ARCHIVES - FIXED ISSUES -->

<!-- # Map Generation Memory Usage

## Problem:

The map generation function's memory usage scales quadratically - O(n²), this will make generating large maps impossible unless the server has a ton of memory.

## Proposal:

Change the map generation function to generate the grid 1 row at a time and save the rows to the SQL database sequentially, freeing each row from scope so it can be garbage collected after it is saved to the disk.

## Result:

Map generation function's memory usage will scale linearly - O(gridSize) allowing for the generation of much larger maps without overloading the server. -->


<!-- # Websocket Closing

The websocket on the production server closes after a period of time.

## Proposal:

Set up an intermittent ping/pong on the websocket to maintain the connection.

## Result:

Connection to game server remains open even if player is idle. -->