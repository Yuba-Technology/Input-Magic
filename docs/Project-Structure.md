In this chapter, we aim to provide an in-depth look at the project structure, detailing how different components interact to create a dynamic and immersive gaming experience.

## Project Structure

The project is divided into three main layers: the Interact Layer, Data Layer, and Rendering Layer. These layers work together to handle player input, manage game data, and render the game state, respectively.

- **Interact Layer**: Receives and processes player input.
- **Data Layer**: Handles game logic, updates the game state, and manages data storage.
- **Rendering Layer**: Renders the game state into a 2D view for the player.

Each layer has its own set of responsibilities and communicates with the others through an event bus, ensuring efficient transmission of information and control signals.

### Core Components

- **Event Bus**: Facilitates communication between the different layers.
- **Game Ticks**: Divided into scheduled ticks and random ticks, they handle fixed-frequency tasks and random events.
- **Data Storage**: Manages all game data storage and retrieval.
- **Event Queue**: Collects events generated from player actions or internal game logic for processing.

In the following sections, we will delve deeper into each layer and component, providing a comprehensive understanding of the project's structure.

### Project Structure Diagram

```mermaid
graph TD
subgraph Interact Layer
A[Receive Player Input]
B[Process Input Event]
A --> B
end

subgraph Data Layer
C["Handle Game Logic
and Update State
(Run tick tasks)"]
subgraph Data
D[Storage]
J[Quene]
end
H[Timer]
I[Data Extraction]
C <--> D
H -.->|Trigger| C
end

subgraph Rendering Layer
E[Receive Data]
F{Need
update?}
G[Render Screen]
E --> F
F --> G
G -.->|Data Request| D
D -->|Provide Data| E
end

B -.->|Player Action| I
I --> J
J --> C
B -.->|Start Frame Rendering| G
C -.->|"Tick Data
(What changed
in this tick)"| E
```

## Project Architecture

1. **Rendering Layer**:

   - **Function**: Responsible for rendering the data provided by the Data Layer into a 2D view, displaying the game state to the player. The Rendering Layer also actively requests necessary data (e.g., chunk data) from the Data Storage within the Data Layer.
   - **Modules**: Includes the rendering engine, graphics processing, UI display, etc.

2. **Data Layer**:

   - **Function**: Handles all game data, including the execution of game ticks, block updates, entity AI calculations, etc. The Data Layer also manages the data storage, ensuring that all data-related operations go through the Data Storage module.
   - **Modules**: Includes game logic processing, physics calculations, state management, and data storage.
   - **Game Ticks**:
     - **Scheduled Ticks**: Executes every 100 milliseconds (0.1 seconds), handling tasks such as block updates and entity movements.
     - **Random Ticks**: In each scheduled tick, randomly selects a block in each chunk to handle random events.
   - **Data Storage**: This module manages all game data storage and retrieval, ensuring consistent and efficient data access.
   - **Event Queue**: Collects events generated from player actions or internal game logic for processing.

3. **Interact Layer**:
   - **Function**: Receives player inputs (keyboard events) and responds by sending commands to the Data Layer and directly triggering the Rendering Layer for immediate updates.
   - **Modules**: Includes input processing, event management, etc.
   - **Key Path**: `src/control/`

## Module Interaction

The game's architecture uses an event bus to facilitate communication between the three core layers: the Rendering Layer, Data Layer, and Interact Layer. The event bus ensures efficient transmission of control signals and data between these layers.

The **Event Bus** transmits the following types of data:

- **Control Flow**:
  - The Interact Layer sends control signals to the Data Layer, e.g., when the player moves.
  - The Interact Layer triggers the Rendering Layer for immediate updates, ensuring real-time reflection of player actions.
  - The Data Layer processes game logic, updates the game state, and sends updated data to the Rendering Layer, triggering rendering as needed.
- **Data Flow**:
  - The Data Layer sends updated data to the Rendering Layer.
  - The Rendering Layer requests necessary data from Data Storage within the Data Layer when needed.

This design ensures effective interaction between layers, enabling real-time responsiveness and smooth data processing.

## Detailed Architecture

In this section, we provided an overview of the project's architecture and its core features, laying the foundation for deeper understanding and development. In the following chapters, we will delve into the specific mechanisms and implementation details of each layer.

By understanding the design of Input-Magic, you’re now equipped to dive deeper. Just like a wizard learns the basics of spellcasting before tackling more complex enchantments, tet's get ready to delve into the architecture of our game!
