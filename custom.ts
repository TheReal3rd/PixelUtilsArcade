/**
* Simple library by me to provide functions and tools to calculate specific math related needs and other specilised tasks.
* Intended for people who already know how to write these functions and already understand Angles, Distances and more.
* I advice teaching yourself this not just use this and create something learn how todo it then use this.
*/


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
    //% blockId="calcAngularPosition" block="CalcAngularPosition PosX:$posX posY:$PosY Angle:$angle Distance:$distance"
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
        while (step < distance && iterCount < 65035) {
            iterCount++;
            currentX = Math.floor((currentX + (1 * tempCos)));
            currentY = Math.floor(currentY + (1 * tempSin));
            step++;
            if (iterCount >= 65033) {
                console.log("Warning raycast reached iteration limit. This could effect performance.");
            }

            if (tiles.tileAtLocationIsWall(tiles.getTileLocation(currentX, currentY))) {
                return new HitResultTileMap(currentX, currentY, HitTypeEnum.HIT);
            } else {
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
}
