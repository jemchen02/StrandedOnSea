export enum Costs {
    WOOD_COST = 0,
    FIBER_COST = 500,
    METAL_COST = 1000,
    MINE_COST = 150,
    MINE_COST_2 = 450,
    TORPEDO_COST = 250,
    TORPEDO_COST_2 = 450,
    REPAIR_COST = 200,
    REPAIR_COST_2 = 500,
    PUMP_COST = 1000,
    SPIKE_COST = 1000,
    RAPID_FIRE_COST = 800,
    CROW_COST = 250,
    RADAR_COST = 500,
    OAR_COST = 0,
    SAIL_COST = 400,
    MOTOR_COST = 800
}
export enum DamageAmounts {
    SPIKE_DAMAGE = 5,
    CANNON_DAMAGE = 10,
    TORPEDO_DAMAGE = 25,
    RAM_DAMAGE = 10,
    MINE_DAMAGE = 25,
    PUMP_DAMAGE = -0.2, //TODO consider moving, this is heal per second
    REPAIR_DAMAGE = 30,
    OBSTACLE_MINE = 15,
    SPLASH_DAMAGE = 15
}
export enum DamageTimes {
    CANNON_TIME = 20,
    TORPEDO_TIME = 20,
    RAM_TIME = 10,
    OBSTACLE_MINE_TIME = 5
}
export enum LevelRewards {
    HOSTILE1 = 250,
    HOSTILE2 = 400,
    OBSTACLE1 = 250,
    OBSTACLE2 = 400,
    SHIPWRECK1 = 250,
    SHIPWRECK2 = 300,
    WHIRLPOOL1 = 250,
    WHIRLPOOL2 = 400
}
export enum LevelData {
    NUM_OBSTACLE_MINES = 120
}
export enum Speeds {
    OAR_SPEED = 65,
    SAIL_SPEED = 78,
    MOTOR_SPEED = 91,
    RAM_SPEED = 80,
    CANNONSHIP_SPEED = 60
}