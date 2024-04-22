export enum Costs {
    WOOD_COST = 0,
    FIBER_COST = 500,
    METAL_COST = 1000,
    MINE_COST = 20,
    TORPEDO_COST = 50,
    REPAIR_COST = 100,
    PUMP_COST = 1000,
    CROW_COST = 250,
    RADAR_COST = 500,
    OAR_COST = 0,
    SAIL_COST = 400,
    MOTOR_COST = 600
}
export enum DamageAmounts {
    CANNON_DAMAGE = 10,
    TORPEDO_DAMAGE = 25,
    RAM_DAMAGE = 5,
    MINE_DAMAGE = 25,
    PUMP_DAMAGE = -0.2, //TODO consider moving, this is heal per second
    REPAIR_DAMAGE = 30,
    OBSTACLE_MINE = 40
}
export enum DamageTimes {
    CANNON_TIME = 20,
    TORPEDO_TIME = 20,
    RAM_TIME = 10,
    OBSTACLE_MINE_TIME = 5
}
export enum LevelRewards {
    HOSTILE1 = 300,
    HOSTILE2 = 500,
    OBSTACLE1 = 300,
    OBSTACLE2 = 500,
    SHIPWRECK1 = 100,
    SHIPWRECK2 = 200,
    WHIRLPOOL1 = 300,
    WHIRLPOOL2 = 500
}
export enum LevelData {
    NUM_OBSTACLE_MINES = 200
}