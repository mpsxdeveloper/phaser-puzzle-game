const config = {
    type: Phaser.AUTO,
    width: 240,
    height: 480,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 35 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

const game = new Phaser.Game(config)
let running = false
let counter = 3
let score = 0
let currentPiece
let mustCreatePiece = true
let elements = ['blue', 'green', 'grey', 'purple', 'red', 'yellow']
let keyPressed = false

function preload() {
    this.load.image('blue', 'element_blue_diamond.png')
    this.load.image('green', 'element_green_diamond.png')
    this.load.image('grey', 'element_grey_diamond.png')
    this.load.image('purple', 'element_purple_diamond.png')
    this.load.image('red', 'element_red_diamond.png')
    this.load.image('yellow', 'element_yellow_diamond.png')
}

function create() {
    this.physics.world.setFPS(120)   
    pieces = this.physics.add.group({
        immovable: false,
        allowGravity: true
    })    
    cursors = this.input.keyboard.createCursorKeys()    
    createPiece(this)
}

function update() {
    if(mustCreatePiece) {
        mustCreatePiece = false
        createPiece(this)        
    }
    else {
        if(cursors.left.isDown && !keyPressed) {
            if(currentPiece.x > 0 && currentPiece.canMove) {
                keyPressed = true
                currentPiece.x -= 48
                this.time.addEvent({ delay: 500, callback: releaseKey, callbackScope: this, loop: false });    
            }
        }
        else if(cursors.right.isDown && !keyPressed && currentPiece.canMove) {
            if((currentPiece.x + currentPiece.width) < game.config.width) {
                keyPressed = true
                currentPiece.x += 48
                this.time.addEvent({ delay: 200, callback: releaseKey, callbackScope: this, loop: false });    
            }
        }
    }       
    if(currentPiece.y + currentPiece.height === game.config.height) {
        currentPiece.canMove = false
        createPiece(this)
    }
}

function createPiece(g) {
    const index = Phaser.Math.RND.between(0, 5)
    const next = document.querySelector("#next")
    next.src = `element_${elements[index]}_diamond.png`
    currentPiece = g.physics.add.sprite(96, 0, elements[index]).setOrigin(0, 0)
    pieces.add(currentPiece)
    g.physics.add.collider(currentPiece, pieces, onCollide)
    mustCreatePiece = false
    currentPiece.body.setCollideWorldBounds(true)
    currentPiece.canMove = true    
}

function onCollide(diamond, diamonds) {
    if(diamond.canMove) {
        diamond.canMove = false
        mustCreatePiece = true
    }
}

function releaseKey() {
    keyPressed = false
}