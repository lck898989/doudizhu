
//定义牌型及相关数字
module.exports={
    Suit : {
        //黑桃
        SPADE : 0,
        //方块 
        BLOCK : 1,
        //红桃
        HEARTS: 2,
        //梅花
        CLUB : 3
    },
    //出牌的数组
    willPopArr : [],
    Server     : "192.168.1.238:1257",
    uniqByObj  : function(array){
        let len = array.length;
        let tempJson = {}
        for(let i = 0;i < len;i++){
            tempJson[`${array[i]}`] = true;
        }
        console.log("tempJson is ",tempJson);
        return Object.keys(tempJson);
    },

}