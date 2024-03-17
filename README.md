# Grid-Space: A Concurrent Multiplayer Web Application

<img src="gridGifSmall.gif" />
<em>Demo of concurrency between two separate clients.</em>

## Overview
Grid-Space is a full-stack concurrent multiplayer web application designed for interactive gaming experiences. It leverages Go's powerful concurrency features to manage real-time communication between the server and multiple clients via websockets.

### Server Component
- **Language:** Go
- **Concurrency:**
    - Batches messages from clients to ensure synchronization.
    - Executes game logic on regular ticks, maintaining consistency across all connected players.
- **Database:**
    - Utilizes an SQLite database on the server to store game data.
- **Benefits of Server-Side Game Logic:**
    - **Security:** By executing game logic on the server, sensitive operations and critical data remain protected from client-side manipulation.
    - **Single Source of Truth:** The server acts as the authoritative source for game state, ensuring consistent gameplay across all clients.

### Client Component
- **Language:** TypeScript
- **Framework:** React
- **Functionality:**
    - Dynamically re-renders game components based on data received from the server.
    - Facilitates seamless interaction between players.
