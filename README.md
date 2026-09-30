## About 
Simple extension that provides math and other utility functions for arcade makecode alongside exposing useful commands to blocks.

### Whats implemented:
* ~~**PI** – Allows you to retrieve the value of pi without manually typing it in.~~
* **Euclidean Distance Calculator** – Allows you to calculate the distance between two positions.
* **Manhattan Distance Calculator** - Calculates the distance between two positions in a grid.
* **Angle Calculator** – Allows you to calculate the angle between two positions.
* **Radians** – Converts a given angle to radians.
* **Degrees** – Converts the given radians back into degrees.
* **Clamp** – Limits a value within a specified range.
* **RaycastTileMap** – Raycasts in a direction to retrieve tile map data, such as whether a wall or sprite is within the area.
* **Velocity** – Calculates the velocity for a position using the provided speed and angle.
* **Angle Position** – Returns the new position based on a given angle, distance, and starting position.
* **Show Stats** – Makes helpful stats be available when using blocks.
* **Show Debug** – Makes the debug view that shows hitboxes and more available when using blocks.
* **Shoot Laser** – Creates a line of sprites towards an angle intended to be used as a laser.
* **Basic Tilemap Pathfinding** - Pathfinding Supply start location and target location and get a list of moves. TileMap only.
* **Time Delay MS** - Milliseconds Delay tracking object.
* **Sprite Raycast** - Used to project raycast to detect whether sprites within the path. Only effects sprites ignores tilempas.
* **Is Tilemap Present** - Used to check if a tilemap is loaded or not.
So now i don't have to keep writing all these commands manually each time lol.

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/thereal3rd/utilityfunctionslib** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/thereal3rd/pixelutilsarcade** and click import

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
