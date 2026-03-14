/**
* Simple library by me to provide functions and tools to calculate specific math related needs and other specilised tasks.
* Intended for people who already know how to write these functions and already understand Angles, Distances and more.
* I advice teaching yourself this not just use this and create something learn how todo it then use this.
*/

//For resetting.
let defaultPallet = hex`
        000000
        FFFFFF
        FF2121
        FF93C4
        FF8135
        FFF609
        249CA3
        78DC52
        003FAD
        87F2FF
        8E2EC4
        A4839F
        5C406C
        E5CDC4
        91463D
        000000
    `;

//To hold the changes.
let workingPallet = hex`
        000000
        FFFFFF
        FF2121
        FF93C4
        FF8135
        FFF609
        249CA3
        78DC52
        003FAD
        87F2FF
        8E2EC4
        A4839F
        5C406C
        E5CDC4
        91463D
        000000
    `;

let directions = [
    [0,1],
    [0,-1],
    [1,0],
    [-1.0]
]

enum HitTypeEnum {
    MISS,
    HIT,
    SPRITE
}

//% blockNamespace="HitResult"
enum HitResultTileMapInfo {
    //% block="Column"
    Column,
    //% block="Row"
    Row,
    //% block="X"
    X,
    //% block="Y"
    Y,
    //% block="HitType"
    HitType,
    //% block="HitSprite"
    HitSprite
}

/**
 * Node Object to store scoring, postion and parent information.
 * @param Position tile.
 * @param Parent tile.
 */
class Node {
    private position: Array<any>;
    private parent : Node;

    public gScore: number;
    public hScore: number;
    public fScore: number;

    constructor(position: Array<any>, parent: Node) {
        this.position = position;
        this.parent = parent;
    }

    public getPosition() {
        return this.position;
    }

    public getParent() {
        return this.parent;
    }
}


/**
 * Hit result class to breakdown and provide information on the raycast hit.
 * @param hitColumn The destination column.
 * @param hitRow The destination row.
 * @param hitType The hit detials using enum representation. Of hit or miss.
 */
class HitResultTileMap {
    private hitColumn: number;
    private hitRow: number;
    private hitType: HitTypeEnum;
    private hitSprite: Sprite;

    constructor(hitColumn: number, hitRow: number, hitType: HitTypeEnum, hitSprite: Sprite = null) {
        this.hitColumn = hitColumn;
        this.hitRow = hitRow;
        this.hitType = hitType;
        this.hitSprite = hitSprite
    }

    public getLocation(): tiles.Location {
        return tiles.getTileLocation(this.hitColumn, this.hitRow)
    }

    public getHitResult(): HitTypeEnum {
        return this.hitType
    }

    public getColumn(): number {
        return this.hitColumn
    }

    public getRow(): number {
        return this.hitRow
    }

    public getHitResultString(): string {
        switch (this.hitType) {
            case HitTypeEnum.HIT:
                return "Hit";
            case HitTypeEnum.SPRITE:
                return "Sprite";
            default:
                return "Miss"
        }
    }

    public getHitSprite(): Sprite {
        return this.hitSprite
    }
}

/**
 * Custom blocks
 */
//% weight=100 color=#990099 icon=""
namespace PixelUtils {
    /**
     * Calculates the distance between to two points.
     * @param posX The X position of the measure from.
     * @param posY The Y position of the measure from.
     * @param posX1 The X position of the measure to.
     * @param posY1 The Y position of the measure to.
     */
    //% block
    //% blockId="calcDistance" block="CalcDistance from X:$posX Y:$posY to X:$posX1 Y:$posY1"
    export function calcDistance(posX: number, posY: number, posX1: number, posY1: number): number {
        let xDiff = posX - posX1;
        let yDiff = posY - posY1;
        return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))
    }

    /**
     * Returns the value of pi.
     */
    //% block
    //% blockID="PI" block="π"
    export function PI(): number {
        return Math.PI
    }

    /**
     * Limit a the given value between given minimal and maximum value.
     * @param value the value you wish to apply the limit to.
     * @param minValue the minimal value.
     * @param maxValue the maximum value.
     */
    //% block
    //% blockId="clamp" block="Clamp Value:$value Min:$minValue Max:$maxValue"
    export function clamp(value: number, minValue: number, maxValue: number): number {
        return Math.max(Math.min(value, maxValue), minValue)
    }

    /**
     * Converts the given angle in degrees to radians.
     * @param degrees The angle in degrees to convert.
     */
    //% block
    //% blockId="toRadians" block="ToRadians $degrees"
    export function toRadians(degrees: number): number {
        return (degrees * Math.PI) / 180;
    }

    /**
     * Converts the given radians to degrees.
     * @param radians The radians to convert to degrees.
     */
    //% block
    //% blockId="toDegrees" block="ToDegrees $radians"
    export function toDegrees(radians: number): number {
        return radians * 57.29577951308232;
    }

    /**
     * Calculates the angle between position.
     * @param posX The X position of the measure from.
     * @param posY The Y position of the measure from.
     * @param posX1 The X position of the measure to.
     * @param posY1 The Y position of the measure to.
    */
    //% block
    //% blockId="calcAngle" block="CalcAngle from X:$posX Y:$posY to X:$posX1 Y:$posY1"
    export function calcAngle(posX: number, posY: number, posX1: number, posY1: number): number {
        let xDiff = posX1 - posX;
        let yDiff = posY1 - posY;
        return toDegrees(Math.atan2(yDiff, xDiff))
    }

    /**
      * Calculates the anglar velocity.
      * @param angle The angular direction the velocity will be for.
      * @param speed The speed you wish to head the direction at.
     */
    //% block
    //% blockId="calcVelocity" block="CalcVelocity Angle:$angle Speed:$speed"
    export function calcVelocity(angle: number, speed: number): Array<number> {
        let sin = Math.sin(toRadians(angle));
        let cos = Math.cos(toRadians(angle));
        return [speed * cos, speed * sin]
    }

    /**
     * Calculates the anglar position.
     * @param posX X to calculate from.
     * @param posY Y to calculate from.
     * @param angle The angular direction the velocity will be for.
     * @param distance The how far the position will be from the current given position.
     */
    //% block
    //% blockId="calcAngularPosition" block="CalcAngularPosition PosX:$posX PosY:$posY Angle:$angle Distance:$distance"
    export function calcAngularPosition(posX: number, posY: number, angle: number, distance: number): Array<number> {
        let sin = Math.sin(toRadians(angle));
        let cos = Math.cos(toRadians(angle));
        return [posX + (distance * cos), posY + (distance * sin)]
    }

    /**
     * Show device stats.
     */
    //% block
    //% blockId="showStats" block="Show Stats"
    export function showStats(): void {
        game.stats = true
    }

    /**
     * Show device debug.
     */
    //% block
    //% blockId="showDebug" block="Show Debug"
    export function showDebug(): void {
        game.debug = true
    }

    /**
     * Fires a Sprite Laser towards an angle. Intended to create lasers within games.
     * @param posX X position to laser from.
     * @param posX Y position to laser from.
     * @param angle Laser direction of travel.
     * @param distance The maximum distance the laser will be shot towards.
     */
    //% block
    //% blockId="laserProjectile" block="ShootLaser from: X:$posX Y:$posY Angle:$angle Distance:$distance Sprite:$sprite"
    //% kind.shadow="spritekind"
    export function laserProjectile(posX: number, posY: number, angle: number, distance: number, sprite: Sprite): void {
        let iterCount = 0;// To prevent runaway code. distance + 10.
        let currentX = posX;
        let currentY = posY;
        let step = 0;
        let tempSin = Math.sin(toRadians(angle));
        let tempCos = Math.cos(toRadians(angle));
        sprites.destroy(sprite)
        let image = sprite.image
        let stepSize = Math.min(image.width, image.height)

        while (step < distance && iterCount < distance + 10) {
            iterCount++;
            currentX = currentX + (stepSize * tempCos);
            currentY = currentY + (stepSize * tempSin);
            step+=stepSize;
            if (iterCount >= distance + 10) {
                console.log("Warning raycast reached iteration limit. This could effect performance.");
            }
            
            let tempProjectile = sprites.create(sprite.image, sprite.kind())
            tempProjectile.setPosition(currentX, currentY)
        }
    }

    /**
     * TileMap Raycast returns results on information of what was hit.
     * @param tileLocation TileMap location to raycast from.
     * @param angle The angle the raycast will be sent towards.
     * @param speed The speed you wish to head the direction at.
     */
    //% block
    //% blockId="tileMapRaycast" block="TileRaycast Column:$col Row:$row Angle:$angle Distance:$distance Kind:$kind"
    //% kind.shadow="spritekind"
    export function tileMapRaycast(col: number, row: number, angle: number, distance: number, kind: number): HitResultTileMap {
        //TODO in the future add a check to see if a tileMap is active or not.
        let iterCount = 0;// To prevent runaway code. Tilemap size limit is 255x255 so 65025 + (10 for little extra room).
        let currentX = col;
        let currentY = row;
        let step = 0;
        let tempSin = Math.sin(toRadians(angle));
        let tempCos = Math.cos(toRadians(angle));
        let iterLimit = 65033;
        while (step < distance && iterCount < iterLimit) {
            iterCount++;
            currentX = Math.floor((currentX + (1 * tempCos)));
            currentY = Math.floor(currentY + (1 * tempSin));
            step++;
            if (iterCount >= iterLimit) {
                console.log("Warning raycast reached iteration limit. This could effect performance.");
            }

            if (tiles.tileAtLocationIsWall(tiles.getTileLocation(currentX, currentY))) {
                return new HitResultTileMap(currentX, currentY, HitTypeEnum.HIT);
            } else {
                if (kind == -1)  continue // Incase people don't need to check for entities.

                let spriteArray = sprites.allOfKind(kind);
                for (let x = 0; x != spriteArray.length; x++) {
                    let sprite = spriteArray[x];
                    let location = sprite.tilemapLocation();
                    if (location.column == currentX && location.row == currentY) {
                        return new HitResultTileMap(currentX, currentY, HitTypeEnum.SPRITE, sprite);
                    }
                }
            }
        }
        return new HitResultTileMap(currentX, currentY, HitTypeEnum.MISS);
    }


    /**
    * Returns hit result information from a raycast.
    * @param resultValue The hit result variable.
    * @param getType The value you wish to retrieve from the result.
    */
    //% block
    //% blockId="getHitResultTileMap" block="RaycastHitResultTileMap Value:$resultValue result:$getType"
    export function getHitResultTileMap(resultValue: HitResultTileMap, getType: HitResultTileMapInfo): any {
        switch (getType) {
            case HitResultTileMapInfo.Column:
                return resultValue.getLocation().column;
            case HitResultTileMapInfo.Row:
                return resultValue.getLocation().row;
            case HitResultTileMapInfo.X:
                return resultValue.getLocation().x;
            case HitResultTileMapInfo.Y:
                return resultValue.getLocation().y;
            case HitResultTileMapInfo.HitType:
                return resultValue.getHitResultString();
            case HitResultTileMapInfo.HitSprite:
                return resultValue.getHitSprite();
        }
    }

    /*
    function reconstruct_path(cameFrom, current)
    total_path := {current}
    while current in cameFrom.Keys:
        current := cameFrom[current]
        total_path.prepend(current)
    return total_path

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(start, goal, h)
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    openSet := {start}

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
    // to n currently known.
    cameFrom := an empty map

    // For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
    gScore := map with default value of Infinity
    gScore[start] := 0

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how cheap a path could be from start to finish if it goes through n.
    fScore := map with default value of Infinity
    fScore[start] := h(start)

    while openSet is not empty
        // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
        current := the node in openSet having the lowest fScore[] value
        if current = goal
            return reconstruct_path(cameFrom, current)

        openSet.Remove(current)
        for each neighbor of current
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            tentative_gScore := gScore[current] + d(current, neighbor)
            if tentative_gScore < gScore[neighbor]
                // This path to neighbor is better than any previous one. Record it!
                cameFrom[neighbor] := current
                gScore[neighbor] := tentative_gScore
                fScore[neighbor] := tentative_gScore + h(neighbor)
                if neighbor not in openSet
                    openSet.add(neighbor)

    // Open set is empty but goal was never reached
    return failure
    */

    //TODO
    //Basic Pathdfinding.
    export function BasicPathfindTileMap(
        fromPosition: tiles.Location,
        toPosition: tiles.Location,
        minDistance: number,
        scanMaxArea: number = 5,
        maxScanBranches: number = 4,
    ): number[][] {

        let currentX = fromPosition.col;
        let currentY = fromPosition.row;

        let resultPathNodes: number [][] = [[currentX, currentY]];

        for(let x = -scanMaxArea; x != scanMaxArea; x++) {
            for (let y = -scanMaxArea; y != scanMaxArea; y++) {
                let stepX = currentX + x;
                let stepY = currentY + y;
                
                if (tiles.tileAtLocationIsWall(tiles.getTileLocation(stepX, stepY))) continue;
                
                let angleToTile = calcAngle(currentX, currentY, stepX, stepY);
                let distanceToTile = calcDistance(currentX, currentY, stepX, stepY);
                let raycastResult = tileMapRaycast(currentX, currentY, angleToTile, distanceToTile, -1);

                //if ()
            }
        }

        return [];
    }

    //Colour pallet switching...
    //% block
    //% blockId="updateColourPallet" block="Update Colour Pallet"
    export function updateColourPallet() {
        image.setPalette(workingPallet);
    }

    //% block
    //% blockId="resetColourPallet" block="Reset Colour Pallet"
    export function resetColourPallet() {
        workingPallet = defaultPallet
        updateColourPallet()
    }

    //% block
    //% blockId="setColourIndex" block="Set Colour Index:$index Red:$red  Green:$green  Blue:$blue "
    export function setColourIndex(index: number, red: number, green: number, blue: number) {
        const MAX_SIZE = 16 - 1;
        if (index > MAX_SIZE || index < 0) {
            console.warn("Incorrect index provided over size or under.");
            index = clamp(index, 0, MAX_SIZE);
        }
        
        const pallet = pins.createBuffer(workingPallet.length)
        for (let i = 0; i < workingPallet.length; i++) {
            pallet[i] = workingPallet[i]
        }

        const offset = index * 3
        pallet[offset] = red
        pallet[offset + 1] = green
        pallet[offset + 2] = blue

        workingPallet = pallet
        updateColourPallet()
    }

}
