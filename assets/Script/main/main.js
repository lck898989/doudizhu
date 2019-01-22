import game from '../game';
cc.Class({
    extends: cc.Component,

    properties: {
        joinRoomPrefab : cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },
    buttonEvent : function(e,data){
        console.log("data is ",data);
        console.log("this.node is ",this.node);
        switch(data){
            case 'joinRoom' :
                // cc.director.loadScene("gameRoom");
                console.log("joinRoomPrefab is ",this.joinRoomPrefab);
                let joinPrefabNode = game.prototype.createNodeFromPrefab.call(this,this.joinRoomPrefab,this.node,0,0);
                console.log("joinPrefabNode is ",joinPrefabNode);
                break;

        }
    },
    update (dt) {
        
    },
});
