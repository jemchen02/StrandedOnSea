import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Actor from "../../Wolfie2D/DataTypes/Interfaces/Actor";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import DirectStrategy from "../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import PlayerActor from "../Actors/PlayerActor";
import PlayerAI from "../AI/Player/PlayerAI";
import { ClosestPositioned } from "../GameSystems/Searching/HW4Reducers";
import BasicTargetable from "../GameSystems/Targeting/BasicTargetable";
import Position from "../GameSystems/Targeting/Position";
import AstarStrategy from "../Pathfinding/AstarStrategy";
import SosScene from "./SosScene";
import InventoryHUD from "../GameSystems/HUD/InventoryHUD";
import PlayerHealthHUD from "../GameSystems/HUD/PlayerHealthHUD";
import CoinHUD from "../GameSystems/HUD/CoinHUD";
import PauseHUD from "../GameSystems/HUD/PauseHUD";
import EnemyActor from "../Actors/EnemyActor";
import HealthbarHUD from "../GameSystems/HUD/HealthbarHUD";
import RamAI from "../AI/NPC/RamAI";
import { GameStateManager, ShipType } from "../GameStateManager";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import TowerAI from "../AI/NPC/TowerAI";
import CannonShipAI from "../AI/NPC/CannonShipAI";
import WhirlpoolAI from "../AI/NPC/WhirlpoolAI";
import { CollisionManager } from "../CollisionManager";
import Input from "../../Wolfie2D/Input/Input";
import { PlayerInput } from "../AI/Player/PlayerController";
import MapScene from "./MapScene";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import Battler from "../GameSystems/BattleSystem/Battler";
import { BattlerEvent } from "../Events";
import LevelEndHUD from "../GameSystems/HUD/LevelEndHUD";
import Layer from "../../Wolfie2D/Scene/Layer";
import { LevelRewards } from "../GameConstants";
import EnemyMineAI from "../AI/EnemyMineAI";
import BlockadeAI from "../AI/NPC/BlockadeAI";
import FloatingLootAI from "../AI/FloatingLootAI";
import NPCActor from "../Actors/NPCActor";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";


export default class BattleScene extends SosScene {

    private inventoryHud: InventoryHUD;
    private healthHUD: PlayerHealthHUD;
    private coinHUD: CoinHUD;
    private pauseHUD: PauseHUD;
    protected scaleFactor: number;
    private healthbars: Map<number, HealthbarHUD>;
    private enemyBattlers: Battler[];
    protected battlerCount: number;

    // The wall layer of the tilemap
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;
    protected player: PlayerActor;

    protected levelEnded: boolean;
    private lostLevel: boolean;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.healthbars = new Map<number, HealthbarHUD>();
        this.levelEnded = false;
        this.lostLevel = false;
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {
        const playerLocation = GameStateManager.get().playerLocation;
        const gameLevel = GameStateManager.get().gameMap[playerLocation.x][playerLocation.y];
        // Load the player and enemy spritesheets
        const playerShipType = GameStateManager.get().shipType;
        switch(playerShipType) {
            case ShipType.WOOD:
                this.load.spritesheet("player1", "sos_assets/spritesheets/player_wood.json");
                break;
            case ShipType.FIBERGLASS:
                this.load.spritesheet("player1", "sos_assets/spritesheets/player_fiberglass.json");
                break;
            case ShipType.METAL:
                this.load.spritesheet("player1", "sos_assets/spritesheets/player_metal.json");
                break;
        }
        this.load.spritesheet("enemyBoat", "sos_assets/spritesheets/hostile.json");
        this.load.spritesheet("tower", "sos_assets/spritesheets/tower.json");
        this.load.image("whirlpool_enemy", "hw4_assets/sprites/whirlpool_enemy.png")
        this.load.spritesheet("blockade", "sos_assets/sprites/blockade.json")
        this.load.spritesheet("loot", "sos_assets/spritesheets/loot.json")
        this.load.spritesheet("explosion", "sos_assets/spritesheets/explosion.json")
        this.load.spritesheet("debris", "sos_assets/spritesheets/debris.json")

        this.load.image("inventorySlot", "hw4_assets/sprites/inventorySlot.png");
        this.load.image("inventoryTab", "hw4_assets/sprites/inventoryTab.png");
        this.load.image("mine", "hw4_assets/sprites/mine.png");
        this.load.image("torpedo", "hw4_assets/sprites/torpedo.png");
        this.load.spritesheet("torpedoProjectile", "sos_assets/spritesheets/torpedo.json")
        this.load.spritesheet("explosion", "sos_assets/spritesheets/explosion.json")
        this.load.image("repair", "hw4_assets/sprites/repair.png");

        this.load.image("healthTab", "hw4_assets/sprites/healthTab.png");
        this.load.image("coinTab", "hw4_assets/sprites/coinStorage.png");

        this.load.image("pause", "hw4_assets/sprites/pause.png");

        this.load.image("modal", "hw4_assets/sprites/modal.png");

        this.receiver.subscribe("pause");
        this.receiver.subscribe(BattlerEvent.BATTLER_KILLED);
        this.receiver.subscribe("gameLoss");
        this.receiver.subscribe("back");

        this.load.audio("mine_place", "hw4_assets/sounds/mine_place.mp3");
        this.load.audio("fire", "hw4_assets/sounds/fire.mp3");
        this.load.audio("fire2", "hw4_assets/sounds/fire2.mp3");
        this.load.audio("explode1", "hw4_assets/sounds/explode1.mp3");
        this.load.audio("hit", "hw4_assets/sounds/hit.mp3");
        this.load.audio("deflect", "hw4_assets/sounds/deflect.wav");

        CollisionManager.get().ResetColliders();
    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(3);

        this.initLayers();
        
        // Create the player
        this.initializePlayer();
        this.initializeHUD();
        this.initializeNPCs();
        this.initializeNavmesh();
    }
    /**
     * @see Scene.updateScene
     */
    public override updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if(Input.isPressed(PlayerInput.PASS_LEVEL) && !this.levelEnded) {
            this.winLevel();
        }
        this.inventoryHud.update(deltaT);
        this.coinHUD.update(deltaT);
        this.healthHUD.update(deltaT);
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
    }

    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case "pause":
                GameStateManager.get().togglePause();
                break;
            case BattlerEvent.BATTLER_KILLED:
                this.handleBattlerKilled(event);
                break;
            case "gameLoss":
                this.loseLevel();
                break;
            case "back":
                GameStateManager.get().togglePause();
                if(this.lostLevel) {
                    GameStateManager.get().restoreSaved();
                    GameStateManager.get().prevWon = false;
                } else {
                    GameStateManager.get().prevWon = true;
                }
                this.sceneManager.changeToScene(MapScene);
                break;
            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in HW4Scene event handler`);
            }
        }
    }
    /** Initializes the layers in the scene */
    protected initLayers(): void {
        this.addLayer("endfront", 8);
        this.addLayer("endback", 7);
        this.addLayer("player", 6)
        this.addLayer("primary", 5);
        this.addLayer("whirlpool", 4)
        this.addUILayer("staticHUD");
        this.addUILayer("slots");
        this.addUILayer("updateHUD");
        this.getLayer("staticHUD").setDepth(1);
        this.getLayer("slots").setDepth(2);
        this.getLayer("updateHUD").setDepth(3);
    }




    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        this.player = this.add.animatedSprite(PlayerActor, "player1", "player");
        this.player.position.set(18, 18);

        this.player.health = 10;
        this.player.maxHealth = 10;

        // Give the player physics
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

        // Give the player PlayerAI
        this.player.addAI(PlayerAI);

        // Start the player in the "IDLE" animation
        this.player.animation.play("IDLE");

        CollisionManager.get().RegisterCollider(this.player);

        this.viewport.follow(this.player);
    }

    protected initializeHUD(): void {
        this.scaleFactor = 2/3;
        this.inventoryHud = new InventoryHUD(this, "inventorySlot", {
            start: new Vec2(36, 175),
            slotLayer: "slots",
            padding: 8,
            itemLayer: "updateHUD",
            staticLayer: "staticHUD",
            mineSprite: "mine",
            torpedoSprite: "torpedo",
            repairSprite: "repair",
            scaleX: this.scaleFactor,
            scaleY: this.scaleFactor
        });
        this.healthHUD = new PlayerHealthHUD(this, "healthTab", "staticHUD", "updateHUD", this.scaleFactor, this.scaleFactor);
        this.coinHUD = new CoinHUD(this, "coinTab", "staticHUD", "updateHUD", this.scaleFactor, this.scaleFactor);
        this.pauseHUD = new PauseHUD(this, "pause", "staticHUD", this.scaleFactor, this.scaleFactor);
    }

    protected initializeNPCs(): void {
        this.enemyBattlers = [];
        this.battlerCount = 0;
        let enemies = this.load.getObject("enemies");
        if("boats" in enemies) {
            for (let i = 0; i < enemies.boats.length; i++) {
                let npc = this.add.animatedSprite(EnemyActor, "enemyBoat", "primary");
                npc.position.set(enemies.boats[i][0], enemies.boats[i][1]);
                npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);
                npc.speed = 10;
                npc.health = 10;
                npc.maxHealth = 10;
                npc.navkey = "navmesh";
                npc.addAI(RamAI, {player: this.player});
                CollisionManager.get().RegisterCollider(npc);
                this.enemyBattlers.push(npc);
                this.battlerCount++;
    
    
                let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
                this.healthbars.set(npc.id, healthbar);
            }
        }
        if("cannonships" in enemies) {
            for (let i = 0; i < enemies.cannonships.length; i++) {
                let npc = this.add.animatedSprite(EnemyActor, "enemyBoat", "primary");
                npc.position.set(enemies.cannonships[i][0], enemies.cannonships[i][1]);
                npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);
                npc.speed = 10;
                npc.health = 10;
                npc.maxHealth = 10;
                npc.navkey = "navmesh";
                npc.addAI(CannonShipAI, {player: this.player});
                CollisionManager.get().RegisterCollider(npc);
                this.enemyBattlers.push(npc);
                this.battlerCount++;
    
    
                let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
                this.healthbars.set(npc.id, healthbar);
            }
        }
        if("towers" in enemies) {
            for (let i = 0; i < enemies.towers.length; i++) {
                let npc = this.add.animatedSprite(EnemyActor, "tower", "primary");
                npc.position.set(enemies.towers[i][0], enemies.towers[i][1]);
                npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);
                npc.health = 30;
                npc.maxHealth = 30;
                npc.addAI(TowerAI, {player: this.player});
                CollisionManager.get().RegisterCollider(npc);
                this.enemyBattlers.push(npc);
                this.battlerCount++;
    
                let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
                this.healthbars.set(npc.id, healthbar);
            }
        }
        if("whirlpools" in enemies) {
            for (let i = 0; i < enemies.whirlpools.length; i++) {
                let npc = this.add.sprite("whirlpool_enemy", "whirlpool");
                npc.addPhysics(new Circle(Vec2.ZERO, 50 * enemies.whirlpools[i][2]), null, false, true);
                npc.scale.set(enemies.whirlpools[i][2], enemies.whirlpools[i][2]);
                npc.position.set(enemies.whirlpools[i][0], enemies.whirlpools[i][1]);
                npc.addAI(WhirlpoolAI, {player: this.player});
    
            }
        }
        if("blockades" in enemies) {
            for (let i = 0; i < enemies.blockades.length; i++) {
                let npc = this.add.animatedSprite(EnemyActor, "blockade", "primary");
                npc.health = 50;
                npc.maxHealth = 50;
                npc.scale.set(enemies.blockades[i][2], enemies.blockades[i][3]);
                npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(npc.size.x * npc.scale.x / 2, npc.size.y * npc.scale.y/2)), null, true, true);
                npc.position.set(enemies.blockades[i][0], enemies.blockades[i][1]);
                npc.addAI(BlockadeAI);
                CollisionManager.get().RegisterCollider(npc);
                this.enemyBattlers.push(npc);
                this.battlerCount++;

                let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/4), offset: npc.size.clone().scaled(0, -1/8)});
                this.healthbars.set(npc.id, healthbar);
            }
        }

        if(enemies.mines){
            for (let i = 0; i < enemies.mines.length; i++) {
                this.spawnMine(enemies.mines[i][0], enemies.mines[i][1])
            }
        }
    }

    public spawnMine(x: number, y: number){
        let npc = this.add.sprite("mine", "primary");
        //npc.addPhysics(new Circle(Vec2.ZERO, 100), null, false, true);
        npc.scale.set(0.15, 0.15);
        npc.position.set(x, y);
        npc.addAI(EnemyMineAI, {player: this.player});
    }

    protected spawnLootBarrel(){
        let tilemap = this.getTilemap("Ocean")
        let size = tilemap.getDimensions()
        let randCoords = new Vec2( Math.round(size.x * Math.random()), Math.round(size.y * Math.random()))
        while (tilemap.getTile(randCoords.x, randCoords.y) != 1){
            randCoords.set(Math.round(size.x * Math.random()), Math.round(size.y * Math.random()))
        }
        let worldCoords = tilemap.getWorldPosition(randCoords.x, randCoords.y)
        
        let barrel = this.add.animatedSprite(NPCActor, "loot", "primary")
        barrel.position.set(worldCoords.x, worldCoords.y)
        barrel.scale.set(0.5, 0.5)
        barrel.addPhysics(new AABB(Vec2.ZERO, new Vec2(barrel.size.x * barrel.scale.x / 2, barrel.size.y * barrel.scale.y/2)), null, false, true);
        barrel.addAI(FloatingLootAI, {player: this.player, rarity:1})
        barrel.animation.play("IDLE")
    }

    protected initializeNavmesh(): void {
        // Create the graph
        this.graph = new PositionGraph();

        let dim: Vec2 = this.walls.getDimensions();
        for (let i = 0; i < dim.y; i++) {
            for (let j = 0; j < dim.x; j++) {
                let tile: AABB = this.walls.getTileCollider(j, i);
                this.graph.addPositionedNode(tile.center);
            }
        }

        let rc: Vec2;
        for (let i = 0; i < this.graph.numVertices; i++) {
            rc = this.walls.getTileColRow(i);
            if (!this.walls.isTileCollidable(rc.x, rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1))

            ) {
                // Create edge to the left
                rc = this.walls.getTileColRow(i + 1);
                if ((i + 1) % dim.x !== 0 && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + 1);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
                }
                // Create edge below
                rc = this.walls.getTileColRow(i + dim.x);
                if (i + dim.x < this.graph.numVertices && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + dim.x);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
                }


            }
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        
        // Add different strategies to use for this navmesh
        navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
        navmesh.registerStrategy("astar", new AstarStrategy(navmesh));

        // TODO set the strategy to use A* pathfinding
        navmesh.setStrategy("astar");

        // Add this navmesh to the navigation manager
        this.navManager.addNavigableEntity("navmesh", navmesh);
    }

    public getWalls(): OrthogonalTilemap { return this.walls; }

    /**
     * Checks if the given target position is visible from the given position.
     * @param position 
     * @param target 
     * @returns 
     */
    public isTargetVisible(position: Vec2, target: Vec2): boolean {

        // Get the new player location
        let start = position.clone();
        let delta = target.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, target.x);
        let maxX = Math.max(start.x, target.x);
        let minY = Math.min(start.y, target.y);
        let maxY = Math.max(start.y, target.y);

        // Get the wall tilemap
        let walls = this.getWalls();

        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(target)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;

    }
    protected handleBattlerKilled(event: GameEvent): void {
        let id: number = event.data.get("id");
        let battler = this.enemyBattlers.find(b => b.id === id);

        if (battler) {
            battler.battlerActive = false;
            this.healthbars.get(id).visible = false;
            this.battlerCount--;
        }
        
    }
    protected endLevel(): void {
        if(!GameStateManager.get().isPaused) {
            GameStateManager.get().togglePause();
        }
        this.levelEnded = true;
    }
    protected winLevel(rewards: number = 0): void {
        this.endLevel();
        new LevelEndHUD(this, "modal", "staticHUD", true, rewards, this.scaleFactor, this.scaleFactor);
        this.emitter.fireEvent("gameend");
    }
    protected loseLevel(): void {
        this.endLevel();
        this.lostLevel = true;
        new LevelEndHUD(this, "modal", "staticHUD", false, 0, this.scaleFactor, this.scaleFactor);
        this.emitter.fireEvent("gameend");
    }
}