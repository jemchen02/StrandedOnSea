export class SOSLevel{
    public iconType : number; //TODO make class better. This is just for testing!

    constructor(){
        this.iconType = 0;
    }
}

export class OverlayStatus{
    public isStorm : boolean;
    public isFog : boolean;
    public isLand : boolean;

    constructor(){
        this.isStorm = false;
        this.isFog = false;
        this.isLand = false;
    }
}