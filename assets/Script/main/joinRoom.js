//加入房间的操作
cc.Class({
    extends: cc.Component,

    properties: {
        labelArr : [cc.Label]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.numberString = '';
        for(let i = 0;i < this.labelArr.length;i++){
            this.labelArr[i].string = '';
        }
    },

    start () {

    },
    buttonEvent(e,data){
        console.log("data is ",data);
        if(data === 'clear'){
            for(let i = 0;i < this.numberString.length;i++){
                this.labelArr[i].string = '';
            }
            this.numberString = '';
        }else if(data === 'back'){
            this.numberString = this.numberString.substring(0,this.numberString.length - 1);
            this.labelArr[this.numberString.length].string = '';
        }else if(data === 'close'){
            this.node.destroy();
        }else{
            if(this.numberString.length >= 6){
                this.numberString = this.numberString.substring(0,6);
            }else{
                this.numberString += data;
            }
            this.fillLabel();
        }
    },
    //填充label内容
    fillLabel : function(){
        for(let i = 0;i < this.numberString.length;i++){
            this.labelArr[i].string = this.numberString[i];
        }
    },
    update (dt) {
        
    },
});
