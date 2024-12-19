import BlinkingBoxes from "./TopDollorDialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TopDollarMenuDialog extends cc.Component {

    @property(cc.Node)
    ParentTopDollor: cc.Node = null;
    
    @property(BlinkingBoxes)
    topDollarDialog: BlinkingBoxes = null;

    onTryAgainButtonClicked() {
        if (!this.topDollarDialog) {
            this.topDollarDialog = this.ParentTopDollor.getComponent(BlinkingBoxes);
        }
        if(this.topDollarDialog.isBlinking) {

            return;
        }
        cc.log("Try again button clicked");
        this.topDollarDialog.startRandomGroupBlinking();
    }
}
