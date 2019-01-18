let Const = require("./Const");
module.exports={
    createSocket : function(){
        let ws = new WebSocket("ws://" + Const.Server);
        ws.onopen = function(e){
            console.log("send text ws was opened");
        };
        //接收服务端数据
        ws.onmessage = function(e){
            console.log("response text msg is ",e.data);

        };
        ws.onerror = function(e){
            console.log("send text fired an error");
        };
        ws.onclose = function(e){
            console.log("websocke instance was closed");
        };
        setTimeout(function(){
            if(ws.readyState === WebSocket.OPEN){
                let data = {
                    data : "hello websocket"
                }
                ws.send(JSON.stringify(data));
                
            }else{
                console.log("websocket wasn't ready");
            }
        },3);
        return ws;
    }
}