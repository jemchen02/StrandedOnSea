import Shape from "../Wolfie2D/DataTypes/Shapes/Shape";
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

    public ResetColliders() : void{
      this.colliders = []
    }
    public remove(node: GameNode): void {
      this.colliders = this.colliders.filter(collider => collider != node);
    }
}