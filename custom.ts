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

/**
 * Custom blocks
 */
//% weight=100 color=#990099 icon=""
namespace MathLib {
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
    //% blockID="PI" block="PI π"
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
        return Math.min(Math.max(value, maxValue), minValue)
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
        let xDiff = posX - posX1;
        let yDiff = posY - posY1;
        return toDegrees(Math.atan2(yDiff, xDiff))
    }

    /**
      * Calculates the anglar velocity.
      * @param angle The angular direction the velocity will be for.
      * @param speed The speed you wish to head the direction at.
     */
    //% block
    //% blockId="calcVelocity" block="CalcVelocity Angle:$angle, Speed:$speed"
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
        return [ posX + (distance * cos), posY + (distance * sin)]
    }

    /**
     * TileMap Raycast returns results on information of what was hit.
     * @param tileLocation TileMap location to raycast from.
     * @param angle The angle the raycast will be sent towards.
     * @param speed The speed you wish to head the direction at.
     */
    //% block
    //% blockId="tileMapRaycast" block="TileRaycast Column:$col Row:$row Angle:$angle Distance:$distance"
    export function tileMapRaycast(col: number, row: number, angle: number, distance: number): HitResultTileMap {
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
            if(iterCount >= 65033) {
                console.log("Warning raycast reached iteration limit. This could effect performance.")
            }

            if(tiles.tileAtLocationIsWall(tiles.getTileLocation(currentX, currentY))) {
                return new HitResultTileMap(currentX, currentY, HitTypeEnum.HIT)
            }
        }
        return new HitResultTileMap(currentX, currentY, HitTypeEnum.MISS)
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

        constructor(hitColumn: number, hitRow: number, hitType: HitTypeEnum) {
            this.hitColumn = hitColumn;
            this.hitRow = hitRow;
            this.hitType = hitType;
        }

        //% block="Get hit location"
        getLocation(): tiles.Location {
            return tiles.getTileLocation(this.hitColumn, this.hitRow)
        }

        //% block="Get hit type"
        getHitResult(): HitTypeEnum {
            return this.hitType
        }

    }

}
