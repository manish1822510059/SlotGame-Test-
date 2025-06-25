
import { _decorator, Component, math, Node, Prefab, ScrollView, tween, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Constants } from './Constants';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;



@ccclass('RollManager')
export class RollManager extends Component {

    public static changeimgbool:boolean = false;


    enableRotation: boolean;

    protected onEnable(): void {

       
        let pos = this.node.children[1].position;
        tween(this.node.children[1])
            .to(0.15,{position:new Vec3(pos.x,pos.y+20)})
            .to(0.15,{position:new Vec3(pos.x,pos.y-20)})
            .call(()=>{
                Constants.wininimgpos =[];
                this.enableRotation = true;
                this.bool = true;
                this.bool1 = true;
                if(this.winnodes.length>0){

                        this.winnodes[0].destroyAllChildren();

                    this.winnodes = [];
                }
            })
            .start();


    }

    endtween(){
        let pos = this.node.children[1].position;
        tween(this.node.children[1])
        .to(0.1,{position:new Vec3(pos.x,-227)})
        .to(0.1,{position:new Vec3(pos.x,-247)})
        .call(()=>{
            if(this.node.name == "reel-004"){ EventManager.instance.emitActionCompleteEvent();}
        })
        .start();
    }

    rollingspeed = 2000;
    bool = true;
    bool1 = true;
    winnodes:Node[] = [];

    update(deltaTime: number) {

        if (this.enableRotation) {
            let xpos = this.node.children[0].position.x;
            let ypos = this.node.children[0].position.y;
            let xpos1 = this.node.children[1].position.x;
            let deltaaY = this.rollingspeed * deltaTime;
            
            
            if (this.bool1) {
                this.node.children[0].setPosition(xpos, ypos - deltaaY);
                this.node.children[1].setPosition(xpos1, this.node.children[1].position.y - deltaaY)
            }
            if (this.node.children[0].position.y <= -247) {
               
                if (this.bool) {
                    
                    this.node.children[1].setPosition(xpos1, 985);
                    RollManager.changeimgbool= true;
                    this.bool = false;
                    
                }


                // console.log("ypos:", this.node.children[1].position.y,ypos1)
                if (this.node.children[1].position.y <= 274) {
                    // console.log("ypos:", this.node.children[1].position.y,ypos1)view-004
                    this.bool1 = false;
                    switch (this.node.name) {
                        case "reel-001":
                            this.node.children[1].setPosition(xpos1, this.node.children[1].position.y - deltaaY / 1.8)
                            this.node.children[0].setPosition(xpos1, this.node.children[0].position.y - deltaaY / 1.8)
                            break;
                        case "reel":
                            this.node.children[1].setPosition(xpos1, this.node.children[1].position.y - deltaaY / 2)
                            this.node.children[0].setPosition(xpos1, this.node.children[0].position.y - deltaaY / 2)
                        break;

                        case "reel-002":
                            this.node.children[1].setPosition(xpos1, this.node.children[1].position.y - deltaaY / 2.2)
                            this.node.children[0].setPosition(xpos1, this.node.children[0].position.y - deltaaY / 2.2)
                        break;

                        case "reel-003":
                            this.node.children[1].setPosition(xpos1, this.node.children[1].position.y - deltaaY / 2.4)
                            this.node.children[0].setPosition(xpos1, this.node.children[0].position.y - deltaaY / 2.4)
                        break;

                        case "reel-004":
                            this.node.children[1].setPosition(xpos1, this.node.children[1].position.y - deltaaY / 2.6)
                            this.node.children[0].setPosition(xpos1, this.node.children[0].position.y - deltaaY / 2.6)
                        break;
                    
                        default:
                            break;
                    }
                    
                    
                }
                if (this.node.children[1].position.y <= -247) {
                    
                    this.enableRotation = false;
                    
                    this.node.children[0].setPosition(xpos, 985);
                    this.node.children[1].setPosition(xpos1, -247);
                    this.endtween();
                    for(const element of Constants.wininimgpos){
                        if(this.node.name == element[0]){
                            this.node.children[1].children[element[1]].children[0].active = true;
                            this.winnodes.push(this.node.children[1].children[element[1]])
                        }
                    }
                    
                    this.node.getComponent(RollManager).enabled = false;
                    if(!Constants.freespin){
                        this.scheduleOnce(()=>{
                            Constants.isspining = false;
                        },1)   
                    }
                }

            }
        }
    }
}


