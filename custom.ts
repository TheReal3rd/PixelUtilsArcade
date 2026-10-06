/**
* Simple library by me to provide functions and tools to calculate specific math related needs and other specilised tasks.
* Intended for people who already know how to write these functions and already understand Angles, Distances and more.
* I advice teaching yourself this not just use this and create something learn how todo it then use this.
*/

const ITER_LIMIT = 65033;
const DIRECTIONS = [[0, 1], [0, -1] ,[1, 0], [-1, 0]]
const DEFAULT_PALLET = hex`
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
    `;//For resetting.

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
        this.gScore = 0;
        this.hScore = 0;
        this.fScore = 0; 
    }

    public equals(other: Node) {
        if (this == other) return true;
        if (!(other instanceof Node)) return false;
        return this.position[0] == other.position[0] && this.position[1] == other.position[1]
    }

    public getPosition() {
        return this.position;
    }

    public getParent() {
        return this.parent;
    }

    public calcFScore() {
        this.fScore = this.gScore + this.hScore;
    }

    public calcHScore(targetPos: Array<any>) {
        this.hScore = PixelUtils.calcManhattanDistance(this.position[0], this.position[1], targetPos[0], targetPos[1]);
    }

    public calcGScore(currentNode: Node) {
        this.gScore = currentNode.gScore + 1
    }
}

class TimeDelayMS {

    private timerStart: number;

    constructor() {
        this.timerStart = game.runtime();
    }

    public reset() {
        this.timerStart = game.runtime();
    }

    public passedMS(ms: number) {
        if(game.runtime() - this.timerStart >= ms) {
            return true
        }
        return false
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
     * Creates and returns a TimeDelayMS object.
     */
    //% block
    //% blockId="createTimeDelay" block="Create TimeDelayMS"
    export function createTimeDelay(): TimeDelayMS {
        return new TimeDelayMS();
    }

    /**
     * Returns whether elapsedTimeMS amount has passed.
     */
    //% block
    //% blockId="hasTimePassedMS" block="HasPassed TimeDelayMS Object:$timeObject MS:$elapsedTimeMS"
    export function hasTimePassedMS(timeObject: TimeDelayMS, elapsedTimeMS: number): boolean {
        return timeObject.passedMS(elapsedTimeMS);
    }


    /**
     * Reset the time object to start measuring time duration from the beginning.
     */
    //% block
    //% blockId="resetTime" block="Reset TimeDelayMS Object:$timeObject"
    export function resetTime(timeObject: TimeDelayMS): void {
        return timeObject.reset();
    }

    /**
     * Calculates the euclidean distance between to two points.
     * @param posX The X position of the measure from.
     * @param posY The Y position of the measure from.
     * @param posX1 The X position of the measure to.
     * @param posY1 The Y position of the measure to.
     */
    //% block
    //% blockId="calcDistance" block="Euclidean Distance from X:$posX Y:$posY to X:$posX1 Y:$posY1"
    export function calcDistance(posX: number, posY: number, posX1: number, posY1: number): number {
        let xDiff = posX - posX1;
        let yDiff = posY - posY1;
        return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
    }

    /**
     * Calculates the Manhattan distance between to two points.
     * @param posX The X position of the measure from.
     * @param posY The Y position of the measure from.
     * @param posX1 The X position of the measure to.
     * @param posY1 The Y position of the measure to.
     */
    //% block
    //% blockId="calcManhattanDistance" block="Manhattan Distance from X:$posX Y:$posY to X:$posX1 Y:$posY1"
    export function calcManhattanDistance(posX: number, posY: number, posX1: number, posY1: number): number {
        let dx = Math.abs(posX - posX1);
        let dy = Math.abs(posY - posY1);
        return dx + dy;
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
        return Math.max(Math.min(value, maxValue), minValue);
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
        return radians * (180.0 / Math.PI);
    }

    /**
     * Converts a percentage to a value range.
     * @param value The percentage.
     * @param minValue The minimal value within the range.
     * @param maxValue The maximum value within the range.
     */
    //% block
    //% blockId="fromPercentage" block="FromPercentage Value:$value Min Value:$minValue Max Value:$maxValue"
    export function fromPercentage(value: number, minValue: number, maxValue: number): number {
        return minValue + (value / 100.0) * (maxValue - minValue);
    }

    /**
     * Converts a value to a percentage.
     * @param value The percentage.
     * @param minValue The minimal value within the range.
     * @param maxValue The maximum value within the range.
     */
    //% block
    //% blockId="toPercentage" block="ToPercentage Value:$value Min Value:$minValue Max Value:$maxValue"
    export function toPercentage(value: number, minValue: number, maxValue: number): number {
        return (value - minValue) / (maxValue - minValue) * 100.0
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
        return toDegrees(Math.atan2(yDiff, xDiff));
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
        return [speed * cos, speed * sin];
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
        return [posX + (distance * cos), posY + (distance * sin)];
    }

    /**
     * Show device stats.
     */
    //% block
    //% blockId="showStats" block="Show Stats"
    export function showStats(): void {
        game.stats = true;
    }

    /**
     * Show device debug.
     */
    //% block
    //% blockId="showDebug" block="Show Debug"
    export function showDebug(): void {
        game.debug = true;
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
        sprites.destroy(sprite);
        let image = sprite.image;
        let stepSize = Math.min(image.width, image.height);

        while (step < distance && iterCount < distance + 10) {
            iterCount++;
            currentX = currentX + (stepSize * tempCos);
            currentY = currentY + (stepSize * tempSin);
            step+=stepSize;
            if (iterCount >= distance + 10) {
                console.log("Warning raycast reached iteration limit. This could effect performance.");
            }
            
            let tempProjectile = sprites.create(sprite.image, sprite.kind());
            tempProjectile.setPosition(currentX, currentY);
        }
    }

    /**
     * Checks if a tilemap is loaded or not.
     */
    //% block
    //% blockId="isTilemapPresent" block="Returns True or False if a tilemap is loaded."
    export function isTilemapPresent(): boolean {
        return game.currentScene().tileMap == null || game.currentScene().tileMap.enabled;
    }

    /**
     * TileMap Raycast returns results on information of what was hit.
     * @param Column the column position for projection.
     * @param Row the row position for projection.
     * @param Angle the angle of projection.
     * @param Distance maximum distance of travel before termination.
     * @param Kind entity kind for spite detection and filtering.
     */
    //% block
    //% blockId="tileMapRaycast" block="TileRaycast Column:$col Row:$row Angle:$angle Distance:$distance Kind:$kind"
    //% kind.shadow="spritekind"
    export function tileMapRaycast(col: number, row: number, angle: number, distance: number, kind: number): HitResultTileMap {
        if (!isTilemapPresent()) {
            console.error("No tilemap present.");
            return new HitResultTileMap(0, 0, HitTypeEnum.MISS);
        }

        let iterCount = 0;// To prevent runaway code. Tilemap size limit is 255x255 so 65025 + (10 for little extra room).
        let currentX = col;
        let currentY = row;
        let step = 0;
        let tempSin = Math.sin(toRadians(angle));
        let tempCos = Math.cos(toRadians(angle));
       
        while (step < distance && iterCount < ITER_LIMIT) {
            iterCount++;
            currentX = Math.floor((currentX + (1 * tempCos)));
            currentY = Math.floor(currentY + (1 * tempSin));
            step++;
            if (iterCount >= ITER_LIMIT) {
                console.log("Warning raycast reached iteration limit. This could effect performance.");
            }

            if (tiles.tileAtLocationIsWall(tiles.getTileLocation(currentX, currentY))) {
                return new HitResultTileMap(currentX, currentY, HitTypeEnum.HIT);
            } else {
                if (kind == -1)  continue; // Incase people don't need to check for entities.

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
     * Sprite Raycast returns results on information on what sprite was hit.
     * @param posX The raycast projection point X.
     * @param posY The raycast projection point Y.
     * @param angle The angle the raycast will be sent towards.
     * @param distance The maximum distance the raycast projects can step.
     * @param kind The sprite to detect a collision with.
     * @param Minimal Distance the minimal distance from porjection to a sprite to trigger a collision. -1 Assumes sprites min size.
     */
    //% block
    //% blockId="spriteRaycast" block="SpriteRaycast X:$posX y:$posY Angle:$angle Distance:$distance Kind:$kind Minimal Distance:$minDistance"
    //% kind.shadow="spritekind"
    export function spriteRaycast(posX: number, posY: number, angle: number, distance: number, kind: number, minDistance: number): HitResultTileMap {
        let iterCount = 0;
        let currentX = posX;
        let currentY = posY;
        let step = 0;
        let tempSin = Math.sin(toRadians(angle));
        let tempCos = Math.cos(toRadians(angle));

        while (step < distance && iterCount < distance + 10) {
            iterCount++;
            currentX = currentX + (1 * tempCos);
            currentY = currentY + (1 * tempSin);
            step++;

            if (iterCount >= distance + 10) {
                console.warn("Warning raycast reached iteration limit. This could effect performance.");
            }

            if (kind == -1) {
                break;
                // TODO make the program hard crash. Else this will be alot of useless compute.
                //How? Error isn't supported? why? Just breaking to escape.
            }

            let spriteArray = sprites.allOfKind(kind);
            for (let x = 0; x != spriteArray.length; x++) {
                let sprite = spriteArray[x];
                let spX = sprite.x;
                let spY = sprite.y;
                if (minDistance == -1){
                    minDistance = Math.min(sprite.width, sprite.height);
                } 

                let distance = calcDistance(currentX, currentY, spX, spY);
                if (distance <= minDistance) {
                    return new HitResultTileMap(currentX, currentY, HitTypeEnum.SPRITE, sprite); // TODO Switch the hitmap result to a dedicated for sprite raycasting.
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

    /**
     * Returns true when the tile at column/row is on the map and is not a wall.
     * Out-of-bounds tiles are treated as blocked (MakeCode reports them as walls).
     */
    function isTileWalkable(col: number, row: number): boolean {
        if (!!isTilemapPresent()) {
            console.error("No tilemap present.");
            return false;
        }
        return !tiles.tileAtLocationIsWall(tiles.getTileLocation(col, row));
    }

    /**
     * Finds a walkable 4-direction path between two tile positions using A*.
     * Returns an array of [column, row] steps from start to end, or [] if unreachable.
     * @param fromPosition Start tile as [column, row]
     * @param toPosition End tile as [column, row]
     */
    //% block
    //% blockId="basicPathfindTileMap" block="Pathfind from $fromPosition to $toPosition"
    export function BasicPathfindTileMap(
        fromPosition: number[],
        toPosition: number[]
    ): number[][] {
        if (!isTilemapPresent()) {
            console.error("No tilemap present.");
            return [];
        }
        let startX = fromPosition[0];
        let startY = fromPosition[1];
        let targetX = toPosition[0];
        let targetY = toPosition[1];

        if (startX == targetX && startY == targetY) {
            return [[startX, startY]];
        }

        // Goal must be walkable; allow starting on a blocked tile so a sprite
        // that somehow sits on a wall can still escape.
        if (!isTileWalkable(targetX, targetY)) {
            return [];
        }

        let startNode = new Node([startX, startY], null);
        startNode.gScore = 0;
        startNode.calcHScore([targetX, targetY]);
        startNode.calcFScore();

        let openList: Node[] = [startNode];
        // Tilemaps are at most 255x255; pack col/row into a single index.
        let closed: boolean[] = [];

        function tileKey(col: number, row: number): number {
            return col + (row << 8);
        }

        function findOpenIndex(col: number, row: number): number {
            for (let i = 0; i < openList.length; i++) {
                let pos = openList[i].getPosition();
                if (pos[0] == col && pos[1] == row) {
                    return i;
                }
            }
            return -1;
        }

        function lowestFIndex(): number {
            let best = 0;
            for (let i = 1; i < openList.length; i++) {
                if (openList[i].fScore < openList[best].fScore) {
                    best = i;
                }
            }
            return best;
        }

        let iterCounter = 0;
        while (openList.length > 0 && iterCounter < ITER_LIMIT) {
            iterCounter++;

            let bestIndex = lowestFIndex();
            let currentNode = openList[bestIndex];
            openList.removeAt(bestIndex);

            let currentPos = currentNode.getPosition();
            let currentX = currentPos[0];
            let currentY = currentPos[1];
            let currentKey = tileKey(currentX, currentY);

            if (closed[currentKey]) {
                continue;
            }
            closed[currentKey] = true;

            if (currentX == targetX && currentY == targetY) {
                let path: number[][] = [];
                let current: Node = currentNode;
                while (current != null) {
                    path.push(current.getPosition());
                    current = current.getParent();
                }
                path.reverse();
                return path;
            }

            for (let dir of DIRECTIONS) {
                let nextX = currentX + dir[0];
                let nextY = currentY + dir[1];
                let nextKey = tileKey(nextX, nextY);

                if (closed[nextKey]) continue;
                if (!isTileWalkable(nextX, nextY)) continue;

                let tentativeG = currentNode.gScore + 1;
                let existingIndex = findOpenIndex(nextX, nextY);

                if (existingIndex >= 0) {
                    if (tentativeG >= openList[existingIndex].gScore) continue;

                    let improved = new Node([nextX, nextY], currentNode);
                    improved.gScore = tentativeG;
                    improved.calcHScore([targetX, targetY]);
                    improved.calcFScore();
                    openList[existingIndex] = improved;
                } else {
                    let neighbor = new Node([nextX, nextY], currentNode);
                    neighbor.gScore = tentativeG;
                    neighbor.calcHScore([targetX, targetY]);
                    neighbor.calcFScore();
                    openList.push(neighbor);
                }
            }
        }

        return [];
    }

    //Colour pallet switching...
    /**
     * Reset the colour pallete back to default options.
     */
    //% block
    //% blockId="resetColourPallet" block="Reset Colour Pallet"
    export function resetColourPallet() {
        workingPallet = DEFAULT_PALLET;
        image.setPalette(workingPallet);
    }

    /**
     * Changes a selected colour pallet index to a new provided colour values.
     * @params index from 1-20 the colour index within the colour pallet.
     * @params red colour value within RGB range 0-255.
     * @params green colour value within RGB range 0-255.
     * @params blue colour value within RGB range 0-255.
     */
    //% block
    //% blockId="setColourIndex" block="Set Colour Index:$index Red:$red  Green:$green  Blue:$blue "
    export function setColourIndex(index: number, red: number, green: number, blue: number) {
        const MAX_SIZE = 16 - 1;
        if (index > MAX_SIZE || index < 0) {
            console.warn("Incorrect index provided over size or under.");
            index = clamp(index, 0, MAX_SIZE);
        }
        
        const pallet = pins.createBuffer(workingPallet.length);
        for (let i = 0; i < workingPallet.length; i++) {
            pallet[i] = workingPallet[i];
        }

        const offset = index * 3;
        pallet[offset] = red;
        pallet[offset + 1] = green;
        pallet[offset + 2] = blue;

        workingPallet = pallet;
        image.setPalette(workingPallet);
    }

    /**
     * Brensenham's line draw within a provided image.
     * @params image the image to draw the line upon.
     * @params posX X position within image space to draw from.
     * @params posY Y position within image space to draw from.
     * @params posX1 X position within image space to draw to.
     * @params posY1 Y position within image space to draw to.
     * @params colour the colour index from the colour pallet from range 0-20.
     */
    //% block
    //% blockId="imageDrawLine" block="Bresenham Draw Line Image:$image X:$posX Y:$posY toX:$posX1 toY:$posY1 Colour:$colour"
    export function imageDrawLine(image: Image, posX: number, posY: number, posX1: number, posY1: number, colour: number): Image {
        //Bresenham's line algorithm
        //https://en.wikipedia.org/wiki/Bresenham's_line_algorithm
        let dx = Math.abs(posX1 - posX);
        let dy = Math.abs(posY1 - posY);
        let x = posX;
        let y = posY;

        let sx = posX > posX1 ? -1 : 1;
        let sy = posY > posY1 ? -1 : 1;
        
        if (dx > dy){
            let err = dx / 2.0;
            while (x != posX1) {
                image.setPixel(x, y, colour);
                err -= dy;
                if(err < 0) {
                    y += sy;
                    err += dx;
                }
                x += sx;
            }
        } else {
            let err = dy / 2.0;
            while (y != posY1) {
                image.setPixel(x, y, colour);
                err -= dx;
                if (err < 0) {
                    x += sx;
                    err += dy;
                }
                y += sy;
            }
        }
        image.setPixel(x,y, colour);
        return image;
    }

    /**
     * Midpoint Circle drawing algorithm.
     * @params image the image to draw the circle upon.
     * @params posX the center X postions of the circle.
     * @params posY the center Y position of the circle.
     * @params radius the circle radius from center.
     * @params colour the colour index from the pallet with range 0-20.
     */
    //% block
    //% blockId="imageDrawCircleMidpoint" block="Midpoint Draw Circle Image:$image X:$posX Y:$posY Radius:$radius Colour:$colour"
    export function imageDrawCircleMidpoint(image: Image, posX: number, posY: number, radius: number, colour: number): Image {
        //https://en.wikipedia.org/wiki/Midpoint_circle_algorithm
        let x = radius;
        let y = 0;
        let decision = 1 - radius;
        while(x >= y) {
            image.setPixel(posX + x, posY + y, colour); // Octant 1
            image.setPixel(posX + y, posY + x, colour); // Octant 2
            image.setPixel(posX - y, posY + x, colour); // Octant 3
            image.setPixel(posX - x, posY + y, colour); // Octant 4
            image.setPixel(posX - x, posY - y, colour); // Octant 5
            image.setPixel(posX - y, posY - x, colour); // Octant 6
            image.setPixel(posX + y, posY - x, colour); // Octant 7
            image.setPixel(posX + x, posY - y, colour); // Octant 8
            y++;
            if (decision <= 0) {
                decision += 2 * y + 1;
            } else {
                x--;
                decision += 2 * (y - x) + 1;
            }
        }
        return image;
    }

    //% block
    //% blockId="imageDrawCircleMidpointFilled" block="Midpoint Draw Circle Filled Image:$image X:$posX Y:$posY Radius:$radius Colour:$colour"
    export function imageDrawCircleMidpointFilled(image: Image, posX: number, posY: number, radius: number, colour: number): Image {
        //https://en.wikipedia.org/wiki/Midpoint_circle_algorithm
        let x = radius;
        let y = 0;
        let radiusError = 1 - x;

        while (x >= y) {
            // Horizontal spans using x as the half-width
            for (let i = posX - x; i <= posX + x; i++) {
                image.setPixel(i, posY + y, colour);
                image.setPixel(i, posY - y, colour);
            }

            // Horizontal spans using y as the half-width
            for (let i = posX - y; i <= posX + y; i++) {
                image.setPixel(i, posY + x, colour);
                image.setPixel(i, posY - x, colour);
            }

            y++;
            if(radiusError < 0) {
                radiusError += 2 * y + 1;
            } else {
                x--;
                radiusError += 2 * (y - x + 1);
            }
        }

        return image;
    }


    //TODO https://en.wikipedia.org/wiki/Xiaolin_Wu's_line_algorithm Try this for the lolz.


    /**
     * Parametric circle draw. Using floating point less efficient.
     * @params image the image to draw the circle upon.
     * @params posX the center X postions of the circle.
     * @params posY the center Y position of the circle.
     * @params radius the circle radius from center.
     * @params colour the colour index from the pallet with range 0-20.
     */
    //% block
    //% blockId="imageDrawCircle" block="Draw Circle Image:$image X:$posX Y:$posY Radius:$radius Colour:$colour"
    export function imageDrawCircle(image: Image, posX: number, posY: number, radius: number, colour: number) : Image {
        //Parametric circle drawing / Parametric equation of a circle
        for(let angle = 0; angle != 360; angle+=1) {
            let pixelPos = calcAngularPosition(posX, posY, angle, radius)
            image.setPixel(pixelPos[0], pixelPos[1], colour)
        }
        return image
    }

}
