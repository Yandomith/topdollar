const { ccclass, property } = cc._decorator;

@ccclass
export default class BlinkingBoxes extends cc.Component {

    @property([cc.Node])
    ParentTopDollor: cc.Node = null;

    boxes: cc.Node[] = [];

    public isBlinking: boolean = false;
    private totalBlinkCount: number = 0;

    @property(cc.JsonAsset)
    private jsonAsset: cc.JsonAsset = null;

    private testValues: any = null;
    private winValues: any = null;
    private randomDelay = 0.3; 
    private winSymbolsIndex: any[] = [];
    private winSymbolCount: number = null;
    private winSymbolsValue: number = 0;

    start() {
        for (let i = 0; i < this.ParentTopDollor.childrenCount; i++) {
            this.boxes.push(this.ParentTopDollor.children[i]);
            this.boxes[i].opacity = 100;
        }

        this.testValues = this.jsonAsset.json.data.data;
        this.winValues = this.testValues.result.rewardWinInfo;
        cc.log("winValues", this.winValues);
        
        this.startRandomGroupBlinking();
    }

    startRandomGroupBlinking() {
        this.resetValues();
        for (let i = 0; i < this.boxes.length; i++) {
            this.boxes[i].opacity = 100;
        }

        this.scheduleNextBlink();
        this.totalBlinkCount = 0;
    }

    scheduleNextBlink() {
        
        this.scheduleOnce(() => {
            this.totalBlinkCount++;
            cc.log("totalBlinkCount", this.totalBlinkCount);
            if (this.totalBlinkCount < 10) {
                cc.log("Blinking...");
                this.blinkRandomBoxes(3);
                this.scheduleNextBlink();
            } else {
                cc.log("Stop blinking");

                this.blinkAllBoxes();
            }
            
        }, this.randomDelay);
    }

    blinkRandomBoxes(count: number) {
        const randomBoxes = this.getRandomBoxes(count);

        randomBoxes.forEach((box) => {
            this.toggleBox(box);

            this.scheduleOnce(() => {
                this.toggleBox(box);
            }, 0.2);
        });
    }

    blinkAllBoxes() {
        for (let i = 0; i < this.boxes.length; i++) {
            this.boxes[i].opacity = 255;

        }
        this.scheduleOnce(() => {
            for (let i = 0; i < this.boxes.length; i++) {
                this.boxes[i].opacity = 100;
            }

            cc.log("Go to next function here");
            this.winTopDollor();


        }, this.randomDelay+1);
    }

    blinkSpecificBoxes() {
        cc.log("I am inside blinkSpecificBoxes");
        

                this.scheduleOnce(() => {

                    this.boxes[this.winSymbolsIndex[this.winSymbolCount-1]].opacity = 255;
                    this.winSymbolCount--;
                    if (this.winSymbolCount > 0) {
                        this.blinkSpecificBoxes();
                    } else {
                        this.isBlinking = false;
                        cc.log("Blinking done set to false" , this.isBlinking);
                        this.addWinScore();
                        return;
                    }
            
        
                }, this.randomDelay+1);
        
                
     

   
       
    }


    getRandomBoxes(count: number): cc.Node[] {
        const shuffled = this.boxes.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }

    toggleBox(box: cc.Node) {
        box.opacity = box.opacity === 100 ? 255 : 100;
    }

    winTopDollor() {
        cc.log("I am inside winTopDollor");
        
        for(let i = 0; i < this.winValues.isWinSymbols.length; i++) {

            if (this.winValues.isWinSymbols[i] != null) {
                // this.boxes[i].opacity = 255;
                this.winSymbolsValue += this.winValues.isWinSymbols[i];
                this.winSymbolsIndex.push(this.winValues.isWinSymbols.indexOf(this.winValues.isWinSymbols[i]));
                this.winSymbolCount = this.winSymbolsIndex.length;
                

            }
        }
        cc.log(this.winSymbolCount);
        cc.log(this.winSymbolsIndex);
        cc.log(this.winSymbolsIndex[this.winSymbolCount-1]," : this is the winSymbolsIndex index");
        this.blinkSpecificBoxes();

    }

    addWinScore() {
        cc.log("I am inside addWinScore");
        cc.log("Won Score: ", this.winSymbolsValue);
    }

    resetValues() {
        this.winSymbolsIndex = [];
        this.winSymbolCount = null;
        this.winSymbolsValue = 0;
        this.isBlinking = true;
    }
}
