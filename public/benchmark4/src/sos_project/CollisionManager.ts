import AABB from "../Wolfie2D/DataTypes/Shapes/AABB";
import Circle from "../Wolfie2D/DataTypes/Shapes/Circle";
import Shape from "../Wolfie2D/DataTypes/Shapes/Shape";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import GameNode from "../Wolfie2D/Nodes/GameNode";

export class CollisionManager {
    private static instance: CollisionManager;
    public static get(): CollisionManager {
      if (CollisionManager.instance){
        return CollisionManager.instance;
      }

      else {
        CollisionManager.instance = new CollisionManager();
        return CollisionManager.instance;
      }
    }

    colliders : GameNode[]

    constructor(){
      this.colliders = [];
    }

    public RegisterCollider(node : GameNode) : void{
      this.colliders.push(node);
    }

    public GetHits(shape : Shape) : GameNode{
      for(let i = 0; i < this.colliders.length; i++){
        if(this.colliders[i].collisionShape.overlaps(shape)) return this.colliders[i];
      }
      return undefined;
    }
    public GetHitsCircle(shape : Circle) : GameNode[]{
      const collided = [];
      for(let i = 0; i < this.colliders.length; i++){
        if(this.checkAABBtoCircleCollision(<AABB>this.colliders[i].collisionShape, shape)) collided.push(this.colliders[i]);
      }
      return collided;
    }

    public ResetColliders() : void{
      this.colliders = []
    }
    public remove(node: GameNode): void {
      this.colliders = this.colliders.filter(collider => collider != node);
    }
    checkAABBtoCircleCollision(aabb: AABB, circle: Circle): boolean {
      // Your code goes here:
      const c_x = circle.center.x;
      const c_y = circle.center.y;
      const aabb_x_low = aabb.topLeft.x;
      const aabb_x_high = aabb.bottomRight.x;
      const aabb_y_low = aabb.topLeft.y;
      const aabb_y_high = aabb.bottomRight.y;
      const closest_x = Math.min(Math.max(c_x, aabb_x_low), aabb_x_high);
      const closest_y = Math.min(Math.max(c_y, aabb_y_low), aabb_y_high);
      const vec_closest = new Vec2(closest_x, closest_y);
      return circle.containsPoint(vec_closest);
    }
}