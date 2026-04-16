/**
* Simple library by me to provide functions and tools to calculate specific math related needs and other specilised tasks.
* Intended for people who already know how to write these functions and already understand Angles, Distances and more.
* I advice teaching yourself this not just use this and create something learn how todo it then use this.
*/

const ITER_LIMIT = 65033;
const DIRECTIONS = [ [0, 1], [0, -1] ,[1, 0], [-1, 0]]


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
        this.hScore = PixelUtils.calcDistance(this.position[0], this.position[1], targetPos[0], targetPos[1]);
    }

    public calcGScore(currentNode: Node) {
        let cPos = currentNode.position
        //PixelUtils.calcDistance(this.position[0], this.position[1], cPos[0], cPos[1]) +
        this.gScore = PixelUtils.calcDistance(this.position[0], this.position[1], cPos[0], cPos[1]) + 1
    }
}

/*
        // Create the f, g, and h values
        child.g = currentNode.g + distance between child and current
        child.h = distance from child to end
        child.f = child.g + child.h
        */


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

    //TODO
    //Basic Pathdfinding.
    export function BasicPathfindTileMap(
        fromPosition: number[],
        toPosition: number[]
    ): number[][] {
        let currentX = fromPosition[0];
        let currentY = fromPosition[1];
        let targetX = toPosition[0];
        let targetY = toPosition[1];
        let currentNode = new Node([currentX, currentY], null);
        currentNode.gScore = 1;
        currentNode.calcHScore([targetX, targetY]);
        currentNode.calcFScore();
        
        /*
        //Before doing anything complex try raycasting directly to the target and see if it s clear.
        let angleToTile = calcAngle(currentX, currentY, targetX, targetY);
        let distanceToTile = calcDistance(currentX, currentY, targetX, targetY);
        let raycastResult = tileMapRaycast(currentX, currentY, angleToTile, distanceToTile, -1);
        if (raycastResult.getColumn() == targetX && raycastResult.getRow() == targetY 
            && raycastResult.getHitResult() == HitTypeEnum.MISS) {
            return [[currentX, currentY]]; // Path is clear just head towards the position.
        }        
        */

        let iterCounter = 0;
        let currentNodeIndex = 0;
        let openNodeList: Node[] = [currentNode];
        let closedNodeList: Node[] = [];

        while(iterCounter < 30) {
            iterCounter++;
    
            //Check the direction adding them to list or open or closed spaces.
            console.log("Dir Check")
            for(let dir of DIRECTIONS) {
                let currentPos = currentNode.getPosition();
                let stepPos = [currentPos[0] + dir[0], currentPos[1] + dir[1]];

                let tempNode = new Node(stepPos, currentNode);
                
                if (openNodeList.find(node => node.equals(tempNode))) continue
                if (closedNodeList.find(node => node.equals(tempNode))) continue

                let tilePos = tiles.getTileLocation(stepPos[0], stepPos[1])
                tiles.setTileAt(tilePos, myTiles.transparency16)
                if (tiles.tileAtLocationIsWall(tilePos)) {
                    closedNodeList.push(tempNode)
                    continue;
                }

                tempNode.calcGScore( currentNode );
                tempNode.calcHScore( [targetX, targetY] );
                tempNode.calcFScore();

                console.log(tempNode.fScore)
                openNodeList.push(tempNode);
                console.log("Pushed new Node")
            }

            console.log("Clean up")
            // Then go through the new additions finding the best position...
            for(let index = 0; index != openNodeList.length; index++) {
                let tempNode = openNodeList[index];
                if (tempNode.fScore < currentNode.fScore) {
                    currentNode = tempNode;
                    currentX = tempNode.getPosition()[0];
                    currentY = tempNode.getPosition()[1];
                    currentNodeIndex = index;
                    console.log("New Current selected")
                    console.log(currentNode.getPosition())
                }
            }

            // Remove the moved from position to closed.
            //openNodeList.splice(currentNodeIndex, 1);
            //closedNodeList.push(currentNode);

            if (currentX == targetX && currentY == targetY) {
                console.log("Finish started...")
                let current = currentNode;
                let path: number[][] = [];
                while(current != null) {
                    path.push(current.getPosition());
                    current = current.getParent();
                }
                path.reverse();
                return path;
            }

        }

        return [];
    }

    //Colour pallet switching...
    //% block
    //% blockId="resetColourPallet" block="Reset Colour Pallet"
    export function resetColourPallet() {
        workingPallet = defaultPallet
        image.setPalette(workingPallet);
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
        image.setPalette(workingPallet);
    }

}
