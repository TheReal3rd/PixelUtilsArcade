/**
 * All the calculates results where calculated using online tools then their results are compared to mine.
 * The only thing i have done is rounded a few values up to simplify the comparisons.
 * Such values with execessive trailing zeros or reocurring values.
 */

function testDistance() {
    console.log("Distance Tests")
    let distTest = PixelUtils.calcDistance(0, 0, 10, 0)
    console.log(distTest == 10.0 ? "Stage 1 correct result. " + distTest : "Stage 1 Incorrect result given. " + distTest)
    distTest = PixelUtils.calcDistance(0, 0, 10, 10)
    console.log(distTest > 14 ? "Stage 2 correct result. " + distTest : "Stage 2 Incorrect result given. " + distTest)
}

function testAngle() {
    console.log("Angle Tests")
    let angularTest = PixelUtils.calcAngle(0, 0, 10, 0)
    console.log(angularTest == 0 ? "Stage 1 correct result. " + angularTest : "Stage 1 Incorrect result given. " + angularTest)
    angularTest = PixelUtils.calcAngle(0, 0, 10, 10)
    console.log(angularTest == 45 ? "Stage 2 correct result. " + angularTest : "Stage 2 Incorrect result given. " + angularTest)
}

function testConverters() {
    console.log("Degrees, radians and clamp converter test")
    console.log("Radians Tests")
    let radians = Math.round(PixelUtils.toRadians(45) * 10000) / 10000 // This rounds the result to 4 Decimal places.
    console.log(radians == 0.7854 ? "Stage 1 correct result. " + radians : "Stage 1 Incorrect result. "+ radians)
    console.log("Degrees Tests")
    let degrees = Math.round(PixelUtils.toDegrees(radians))
    console.log(degrees == 45 ? "Stage 2 correct result. " + degrees : "Stage 2 Incorrect result. "+  degrees)
    console.log("Clamp Tests")
    let value = 8000
    value = PixelUtils.clamp(value, 10, 100)
    console.log(value == 100 ? "Stage 3 correct result. " + value : "Stage 3 Incorrect result. " + value)
    value = 5
    value = PixelUtils.clamp(value, 10, 100)
    console.log(value == 10 ? "Stage 4 correct result. " + value : "Stage 4 Incorrect result. " + value)
    value = 60
    value = PixelUtils.clamp(value, 10, 100)
    console.log(value == 60 ? "Stage 5 correct result. " + value : "Stage 5 Incorrect result. " + value)
}

function testVelocity() {
    console.log("Velocity test")
    let velocity = PixelUtils.calcVelocity(0, 200)
    console.log(velocity[0] == 200 && velocity[1] == 0 ? "Stage 1 correct result." : "Stage 1 Incorrect result. ")
    velocity = PixelUtils.calcVelocity(60, 150)
    //console.log(Math.round(velocity[0]) + " | " + Math.round(velocity[1]))
    console.log(Math.round(velocity[0]) == 75 && Math.round(velocity[1]) == 130 ? "Stage 2 correct result." : "Stage 2 Incorrect result. ")
    console.log("Position test")
    let position = PixelUtils.calcAngularPosition(0, 0, 0, 200)
    console.log(Math.round(position[0]) == 200 && Math.round(position[1]) == 0 ? "Stage 3 correct result." : "Stage 3 Incorrect result. ")
    position = PixelUtils.calcAngularPosition(0, 0, 244, 200)
    //console.log(Math.round(position[0]) + " | " + Math.round(position[1]))
    console.log(Math.round(position[0]) == -88 && Math.round(position[1]) == -180 ? "Stage 4 correct result." : "Stage 4 Incorrect result. ")
}

namespace myTiles {
    export const transparency16 = image.ofBuffer(hex``);

    //% blockIdentity=images._tile
    export const tile0 = img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . 2 . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . 2 . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
    `
}

function testRaycast() {
    tiles.setTilemap(tiles.createTilemap(
        hex`1000100001010101010101010101010101010101010101010101010101010101010101010101010101010103010101010101010101010101010101010101010501010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101020101010401010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101`,
        img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . 2 . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . 2 . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`,
        [myTiles.transparency16, sprites.castle.tileGrass2, sprites.castle.tileDarkGrass3, sprites.builtin.forestTiles10, sprites.swamp.swampTile9, sprites.castle.tilePath5],
        TileScale.Sixteen
    ))
    let mySprite = sprites.create(img`
    ........................
    ........................
    ........................
    ........................
    ..........ffff..........
    ........ff1111ff........
    .......fb111111bf.......
    .......f11111111f.......
    ......fd11111111df......
    ......fd11111111df......
    ......fddd1111dddf......
    ......fbdbfddfbdbf......
    ......fcdcf11fcdcf......
    .......fb111111bf.......
    ......fffcdb1bdffff.....
    ....fc111cbfbfc111cf....
    ....f1b1b1ffff1b1b1f....
    ....fbfbffffffbfbfbf....
    .........ffffff.........
    ...........fff..........
    ........................
    ........................
    ........................
    ........................
    `, SpriteKind.Player)
    scene.cameraFollowSprite(mySprite)
    let tempPos = tiles.getTileLocation(7, 7)
    mySprite.setPosition(tempPos.x, tempPos.y)
    let mySprite2 = sprites.create(img`
    e e e . . . . e e e . . . . 
    c d d c . . c d d c . . . . 
    c b d d f f d d b c . . . . 
    c 3 b d d b d b 3 c . . . . 
    f b 3 d d d d 3 b f . . . . 
    e d d d d d d d d e . . . . 
    e d f d d d d f d e . b f b 
    f d d f d d f d d f . f d f 
    f b d d b b d d 2 f . f d f 
    . f 2 2 2 2 2 2 b b f f d f 
    . f b d d d d d d b b d b f 
    . f d d d d d b d d f f f . 
    . f d f f f d f f d f . . . 
    . f f . . f f . . f f . . . 
    `, SpriteKind.Enemy)
    tempPos = tiles.getTileLocation(7, 2)
    mySprite2.setPosition(tempPos.x, tempPos.y)
    let resultTest = PixelUtils.tileMapRaycast(
        7,
        7,
        180,
        6,
        SpriteKind.Enemy
    )
    console.logValue("(Wall -> Hit) HitType", PixelUtils.getHitResultTileMap(resultTest, HitResultTileMapInfo.HitType))
    resultTest = PixelUtils.tileMapRaycast(
        7,
        7,
        270,
        6,
        SpriteKind.Enemy
    )
    console.logValue("(Sprite -> Sprite) HitType", PixelUtils.getHitResultTileMap(resultTest, HitResultTileMapInfo.HitType))
    resultTest = PixelUtils.tileMapRaycast(
        7,
        7,
        60,
        10000000000000000,
        SpriteKind.Enemy
    )
    console.logValue("(TooFar -> Miss) HitType", PixelUtils.getHitResultTileMap(resultTest, HitResultTileMapInfo.HitType))
    let angledWallPos = tiles.getTileLocation(11, 3)
    let angleTo = PixelUtils.calcAngle(//This doesn't seem right but works. by swapping them around.
        angledWallPos.x,
        angledWallPos.y,
        mySprite.x,
        mySprite.y
    )
    //console.log(angleTo)
    resultTest = PixelUtils.tileMapRaycast(
        7,
        7,
        angleTo,
        7,
        SpriteKind.Enemy
    )
    console.logValue("(Wall Angled -> Hit) HitType", PixelUtils.getHitResultTileMap(resultTest, HitResultTileMapInfo.HitType))
}

testDistance()
testAngle()
testConverters()
testVelocity()
testRaycast()