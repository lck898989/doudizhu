/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-01-16 14:46:10 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-18 13:12:49
 * 
 * 扑克类
 * 
 */
let game = require('./game');
let Const = require("./Const");
cc.Class({
    extends: cc.Component,

    properties: {
        type : {
            default : '',
            type    : cc.String
        },
        touched : false,
        number : 'A',
        //被滑动过
        moved  : false,
        //编号
        index : 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Array.prototype.contain = function(node){
            let len = this.length;
            for(let i = 0;i < len;i++){
                if(this[i].x === node.x && this[i].y === node.y){
                    return true;
                }
            }
            return false;
        }
        console.log("牌型是：",this.type);
        this.node.on("touchstart",function(e){
            console.log("开始触摸时候的事件对象是：",e);
            if(this.type !== 'xw' && this.type !== 'dw'){
                let numberString = this.node.getChildByName('left-top').getChildByName('text').getComponent(cc.Label).string;
                console.log("该"+ numberString + this.type +  "牌被点击了");
                this.number = numberString;
            }else{
                if(this.type === 'xw'){
                    this.number = 'xw';
                }else if(this.type === 'dw'){
                    this.number = 'dw';
                }
            }
            this.node.color = cc.Color.WHITE.fromHEX('#EBEAEA');
            //被点击过了，当再次点击的时候该牌不会向上移动
            
        }.bind(this));
        this.node.on("touchmove",function(e){
            this.node.color = cc.Color.WHITE.fromHEX('#EBEAEA');
        }.bind(this));
        this.node.on("touchend",function(e){
            if(!this.touched){
                this.moveUp();
            }else{
                this.moveDown();
            }
            this.touched = !this.touched;
            this.node.color = cc.Color.WHITE.fromHEX("#FFFFFF");
        }.bind(this));
        this.node.on("touchcancel",function(e){
            if(!this.touched){
                this.moveUp();
            }else{
                this.moveDown();
            }
            this.touched = !this.touched;
            this.node.color = cc.Color.WHITE.fromHEX("#FFFFFF");
        }.bind(this))
    },

    start () {

    },
    update (dt) {
        
    },
    //向上移动牌
    moveUp : function(){
        let self = this;
        let currentPosition = this.node.getPosition();
        if(currentPosition.y === 0){
            currentPosition.y += 50;
            console.log("currentPosition is ",currentPosition);
            let moveAction = cc.moveTo(0.1,currentPosition);
            this.node.runAction(cc.sequence(moveAction,cc.callFunc(function(){
                console.log("上移动作执行完毕");
                self.node.color = cc.Color.WHITE.fromHEX("#FFFFFF");
                self.node.y = 50;
                console.log("上移之后的位置是：",self.node.y);
            })));
        }
    },
    moveDown : function(){
        let self = this;
        let currentPosition = this.node.getPosition();
        if(currentPosition.y === 50){
            currentPosition.y -= 50;
            let moveAction = cc.moveTo(0.1,currentPosition);
            this.node.runAction(cc.sequence(moveAction,cc.callFunc(function(){
                console.log("下移动作执行完毕");
                self.node.color = cc.Color.WHITE.fromHEX('#FFFFFF');
                self.node.y = 0;
            })));
        }
    },
    onDestroy : function(){
        this.times = 0;
    }
});
