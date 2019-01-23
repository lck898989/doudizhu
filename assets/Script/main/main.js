cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // let size = new cc.Size(1920,1080);
        //获取到设计分辨率
        let size = this.node.getComponent(cc.Canvas).designResolution;
        let frameSize = cc.view.getFrameSize();
        console.log("frameSize is ",frameSize);
        if(size.width / size.height < frameSize.width / frameSize.height){
            //设计分辨率的宽高比 < 屏幕分辨率的宽高比
            console.log("要适配宽度了");
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_WIDTH);
        }else{
            console.log("要适配高度了");
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_HEIGHT);
        }
        let sysDesign = cc.view.getResolutionPolicy();
    },

    start () {

    },
    buttonEvent : function(e,data){
        console.log("data is ",data);
    },
    update (dt) {},
});
