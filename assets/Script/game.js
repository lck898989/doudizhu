/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-01-16 13:45:31 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-20 20:28:36
 */
let Const = require('./Const');
let Websocket = require('./websocket');
cc.Class({
    extends: cc.Component,

    properties: {
        //牌型的预制体数组
        poker_prefab_arr : {
            type    : [cc.Prefab],
            default : []
        },
        //所有牌节点的父节点
        poker_parent : {
            default : null,
            type : cc.Node,
        },
        //在所有牌节点之上进行滑动
        moved : false
    },
    onLoad () {
        //自己是否是地主
        this.isHost = false;
        //建立长连接
        this.websocket = Websocket.createSocket();
        //是否生成牌成功
        this.createOver = false;
        //需要向上移动的节点数组
        this.pokerArr = [];
        //创建所有牌
        this.allPokers = this.createAllPokers();
        // this.createPoker();
        //自己的牌型数组
        this.selfPokers = this.getPokers();
        //玩家二
        this.enemy1 = this.getPokers();
        //玩家三
        this.enemy2 = this.getPokers();
        console.log("自己的牌是：",this.selfPokers);
        //对自己的牌进行排序
        this.BubbleSortForPokers(this.selfPokers);
        console.log("排序后自己的牌是：",this.selfPokers);
        //显示自己的牌
        this.showSelfPoker();
        //滑动选择的牌型数组
        this.moveArr = [];
        //在所有牌的父节点上的一系列事件
        this.poker_parent.on("touchmove",this.moveOnPokerParent,this);
        this.poker_parent.on("touchcancel",this.cancelOnParentPoker,this);
        this.poker_parent.on("touchend",this.endOnParentPoker,this);
        console.log("玩家二的牌是：",this.enemy1);
        console.log("玩家三的牌是：",this.enemy2);
        console.log("剩下的牌是：");
    },
    //在所有牌的父节点上滑动事件
    moveOnPokerParent : function(e){
        console.log("触点开始的位置是：",e.touch.getStartLocation().x);
        console.log("e is ",e.touch.getLocationX());
        let distance = e.touch.getLocationX() - e.touch.getStartLocation().x;
        this.moveArr = [];
        let nodespacestartPoint = this.poker_parent.convertToNodeSpaceAR(e.touch._startPoint);
        let nodespaceendPoint = this.poker_parent.convertToNodeSpaceAR(e.touch._prevPoint);
        if(this.createOver && this.pokerArr.length !== 0){
            // console.log("开始节点--》",this.pokerArr[i].range.start,"结束位置：---》",this.pokerArr[i].range.end);
            for(let i = 0,len=this.pokerArr.length;i < len;i++){
                // console.log("start-->",this.pokerArr[i].range.start,'end-->',this.pokerArr[i].range.end);
                //开始节点
                if(nodespacestartPoint.x >= this.pokerArr[i].range.start && nodespacestartPoint.x <= this.pokerArr[i].range.end){
                    if(!this.moveArr.includes(i)){
                        this.moveArr.push(i);
                    }
                }
                else if(nodespaceendPoint.x >= this.pokerArr[i].range.start && nodespaceendPoint.x <= this.pokerArr[i].range.end){
                    if(!this.moveArr.includes(i)){
                        this.moveArr.push(i);
                    }
                }else{
                    this.pokerArr[i].node.color = cc.Color.WHITE.fromHEX('#FFFFFF');
                }
            }
            let start = this.moveArr[0];
            let end = this.moveArr[this.moveArr.length - 1];
            this.moveArr = [];
            for(let i = start; i <= end; i++){
                if(!this.moveArr.includes(i)){
                    this.moveArr.push(i);
                    this.pokerArr[i].node.color = cc.Color.WHITE.fromHEX('#EBEAEA');
                }
            }
        }
    },
    //在所有牌的父节点上取消移动
    cancelOnParentPoker : function(e){
        console.log("moveArr is ",this.moveArr);
        console.log("moved is ",this.moved);
        console.log("事件源的节点是：",e.target);
        let len = this.moveArr[this.moveArr.length - 1];
        for(let i = this.moveArr[0];i <= len;i++){
            if(!this.moved){
                console.log("moved false's moveArr ",this.moveArr);
                this.pokerArr[i].node.getComponent('Poker').moveUp();
                Const.willPopArr.push(this.pokerArr[i].node.getComponent('Poker').number);
            }else{
                let popArr = Const.willPopArr;
                console.log("popArr is ",popArr);
                console.log("moveArr is ",this.moveArr);
                for(let i = this.moveArr[0];i <= this.moveArr[this.moveArr.length - 1];i++){
                    this.pokerArr[i].node.getComponent('Poker').moveDown();
                    this.pokerArr[i].node.getComponent('Poker').touched = !this.pokerArr[i].node.getComponent("Poker").touched;
                    this.pokerArr[i].node.color = cc.Color.WHITE.fromHEX('#FFFFFF');
                }
                Const.willPopArr = [];
                this.moveArr = [];
            }
        }
        this.moved = !this.moved;
    },
    //在所有牌的父节点上移动结束
    endOnParentPoker(e){
        let targetNode = e.target;
        console.log("事件源节点是：",targetNode);
        let len = this.moveArr.length;
        if(len >= 1){
            for(let i = this.moveArr[0];i <= this.moveArr[this.moveArr.length - 1];i++){
                if(!this.moved){
                    console.log("moved false's moveArr ",this.moveArr);
                    this.pokerArr[i].node.getComponent('Poker').moveUp();
                    Const.willPopArr.push(this.pokerArr[i].node.getComponent('Poker').number);
                }else{
                    let popArr = Const.willPopArr;
                    console.log("popArr is ",popArr);
                    console.log("moveArr is ",this.moveArr);
                    for(let i = this.moveArr[0];i <= this.moveArr[this.moveArr.length - 1];i++){
                        if(this.pokerArr[i].node === targetNode && this.pokerArr[i].node.getComponent('Poker').touched){
                            this.pokerArr[i].node.getComponent('Poker').moveDown();
                            this.pokerArr[i].node.getComponent('Poker').touched = !this.pokerArr[i].node.getComponent("Poker").touched;
                            this.pokerArr[i].node.color = cc.Color.WHITE.fromHEX('#FFFFFF');
                        }
                    }
                    Const.willPopArr = [];
                    this.moveArr = [];
                }
            }
            this.moved = !this.moved;
        }
    },
    start () {
        
    },
    //显示自己的17张牌如果自己是地主的话就显示21张
    showSelfPoker : function(){
        console.log("自己的牌是：",this.selfPokers);
        let dis = [];
        for(let i = 0;i < this.selfPokers.length;i++){
            let disItem = {};
            let pokerNumber = this.selfPokers[i].value;
            //显示 J Q K A 
            if(pokerNumber > 10 && pokerNumber < 15){
                pokerNumber = this.createPokerNumber(pokerNumber);
            }else if(pokerNumber === 15){
                pokerNumber = '2';
            }else{
                if(pokerNumber !== 16 && pokerNumber !== 17){
                    pokerNumber = pokerNumber.toString();
                }
            }
            let randomNum = 0;
            switch(this.selfPokers[i].type){
                case '♤':
                    randomNum = 0;
                    break;
                case '♢':
                    randomNum = 1;
                    break;
                case '♡':
                    randomNum = 2;
                    break;
                case '♧':
                    randomNum = 3;
                    break;
                case 'x':
                    randomNum = 4;
                    break;
                case 'd':
                    randomNum = 5;
                    break;          
            }
            console.log("pokerNumber is ",pokerNumber);
            console.log("牌的父节点的长度是：",this.poker_parent.width);
            let pokerItem = this.createNodeFromPrefab(this.poker_prefab_arr[randomNum],this.poker_parent,0,0);
            let targetPosition = cc.v2(-(this.poker_parent.width/2 - 100 - i * 100),0);
            disItem.targetPosition = targetPosition;
            disItem.node = pokerItem;
            //该节点所处的范围
            disItem.range = {
                start : targetPosition.x - pokerItem.width/2,
                end   : targetPosition.x + pokerItem.width/2
            };
            if(randomNum < 4){
                pokerItem.getChildByName('left-top').getChildByName('text').getComponent(cc.Label).string = pokerNumber;
                pokerItem.getChildByName('right-bottom').getChildByName('text').getComponent(cc.Label).string = pokerNumber;
                pokerItem.getComponent('Poker').number = pokerNumber;
            }else{
                pokerItem.getComponent('Poker').number = pokerItem.getComponent('Poker').type;
            }
            pokerItem.getComponent('Poker').index = i;
            dis.push(disItem);
        }
        this.createOver = true;
        console.log("dis is ",dis);
        this.pokerArr = dis;
        dis.forEach(element => {
           element.node.runAction(cc.spawn(cc.moveTo(0.5,element.targetPosition),cc.callFunc(function(){
                console.log("动作执行完毕");
           })))
        });
    },
    //对生成的牌进行排序冒泡排序
    BubbleSortForPokers : function(arr){
        let len = arr.length;
        for(let i = 0;i < len - 1;i++){
            for(let j = 0;j < len - 1 - i;j++){
                if(arr[j].value < arr[j + 1].value){
                    //交换元素
                    let temp;
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    },
    //生成54张牌
    createAllPokers : function(){
        let pokerTypeArr = [];
        for(let i = 1;i < 14;i++){
            //花色数组
            let typeArr = ['♤','♢','♧','♡'];
            for(let j = 0;j < typeArr.length;j++){
                if(i === 1){
                    let tempJson = {
                        value : 14
                    }
                    tempJson.type = typeArr[j];
                    pokerTypeArr.push(tempJson);
                }else if(i === 2){
                    let tempJson = {
                        value : 15
                    }
                    tempJson.type = typeArr[j];
                    pokerTypeArr.push(tempJson);
                }else{
                    let tempJson = {
                        value : i
                    }
                    tempJson.type = typeArr[j];
                    pokerTypeArr.push(tempJson);
                }
            }
        }
        pokerTypeArr.push({value : 16,type:'x'});
        pokerTypeArr.push({value : 17,type:'d'});
        return pokerTypeArr;
    },
    //从54张牌中挑出自己的17张牌
    getPokers : function(){
        let selfPokers = [];
        for(let i = 0;i < 17;i++){
            let r = this.createRandom(0,this.allPokers.length);
            selfPokers.push(this.allPokers[r]);
            // poker.splice(r,1);
            this.allPokers.splice(r,1);
        }
        return selfPokers;
    },
    createPokerNumber : function(num){
        let poket_text;
        switch(num){
            case 14 : 
                poket_text = 'A';
                break;
            case 11 : 
                poket_text = 'J';
                break;
            case 12 : 
                poket_text = 'Q';
                break;
            case 13 : 
                poket_text = 'K';
                break;
        }
        return poket_text;
    },
    //生成随机数
    /**
     * @param  {Number} min 生成随机数的最小范围
     * @param  {Number} max 生成随机数的最大范围
     */
    createRandom : function(min,max){
        return Math.floor(Math.random()*(max - min) + min);
    },
    //创建预制体
    /**
     * @param  {cc.Prefab} prefab 预制体节点
     * @param  {cc.Node} parent 预制体生成节点的父节点
     * @param  {Number} x 生成节点的x坐标
     * @param  {Number} y 生成节点的y坐标
     */
    createNodeFromPrefab :function(prefab,parent,x,y){
        let prefabNode = cc.instantiate(prefab);
        prefabNode.parent = parent;
        prefabNode.x = x;
        prefabNode.y = y;
        return prefabNode;
    },
    //确定出牌
    buttonEvent : function(e,arg){
        switch(arg){
            case 'showCart' :
                console.log("点击确定出牌按钮后出牌的数组是：",Const.willPopArr);
                console.log("出牌的索引位置是：",this.moveArr);
                //将这几张牌添加一个父节点，移动父节点
                let newNode = new cc.Node();
                newNode.x = (this.pokerArr[this.moveArr[0]].node.x + this.pokerArr[this.moveArr[this.moveArr.length - 1]].node.x)/2;
                newNode.y = 0;
                newNode.parent = this.poker_parent;
                for(let i = this.moveArr[0];i <= this.moveArr[this.moveArr.length - 1];i++){
                    // this.popArr[i].node.parent = newNode;
                    this.pokerArr[i].node.parent = newNode;
                }
                console.log("newNode is x ",newNode.x);
                console.log("newNode is y ",newNode.y);
                break;
            case 'ready' :
                let data = {
                    data : 'ready'
                };
                this.websocket.send(JSON.stringify(data));
                break;

        }
    },
    backPro : function(){
        return {
            willPopArr : []
        }
    },
    //游戏准备
    ready : function(e){
        
    },
    update (dt) {

    },
});
