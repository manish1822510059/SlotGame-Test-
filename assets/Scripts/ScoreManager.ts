
import { _decorator, Component, Label, math, Node, ParticleSystem2D, sp, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


 
@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property(Label)
    Score: Label = null;
    @property(Node)
    scoreanimnode: Node;
    public static score = false;
    public static overallScore = 150;
    

    counter = 0;

    protected onEnable(): void {
        ScoreManager.score = true;
    }

    angle = 0;
    speed = 10;

    update(deltaTime: number) {
        if (ScoreManager.score) {
            this.counter += deltaTime*10;
            if(ScoreManager.overallScore >= this.counter ){

            this.Score.string = "$ "+this.counter.toFixed(2);
        }else{
            this.scheduleOnce(()=>{
                this.node.active = false;
            },1.5)
            ScoreManager.score = false;
        }

        }
        this.angle += this.speed*deltaTime;
        this.scoreanimnode.setRotationFromEuler(0,0,this.angle)
    }
   
}

