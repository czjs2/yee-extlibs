/**
 * Created by zhuqizhong on 17-10-11.
 */

var Component = require('OStars/Core/Base').Component;
const _ = require('lodash');
const Q = require('q');
const async = require('async-q');
/**
 *
 */
class DoorOnOut extends Component{
    constructor(store_info, manager){
        store_info.inputs = [{"type": 'object'},{"type": 'object'}];
        store_info.outputs = [{"type": 'object'},{"type":"object"},{"type":"object"}];
        store_info.config_setting =[{name:'cameraId',type:"string"}]
        super(store_info,manager);
    }
    setConfig(newConfig){
        let self = this;
        if(newConfig){
            return Component.prototype.setConfig.call(this, newConfig)
                .then(function () {
                    return self.createBusNode(self.URI);
                }).then(function (newCreated) {
                    self.getBusNode(self.URI).updateReqCmdProc('ctrl', function (data, sender) {
                        console.log('ctrl:', JSON.stringify(data));

                        self.onValueChanged.call(self,data.data.data);
                    });

                });
        }
    }
    onValueChanged(data){

        let pin,value;
        let typepin = this.getConfigVal('type'+((!_.isUndefined(data.pin)&&data.pin.toString())||data));
        if(_.isNumber(data) ){
            pin = data;
            value = true;
        } else if(typepin !== 'object') {
            pin = data.pin ;
            value = true;
        }else{
            pin = data.pin;
            value = data.value;
        }
        if(pin === 0 || pin === 1){
            let delay = this.getConfigVal('delay_'+pin) || 300;
            this.setOutLatchVal(pin,value);
            this.updateOutput();
            if(this.latHandle[pin]){
                clearTimeout(this.latHandle[pin]);
                this.latHandle[pin] = null;
            }
            this.latHandle[pin] = setTimeout(function(){
                this.setOutLatchVal(pin,false);
                this.updateOutput();
            }.bind(this),delay);
        }else{
            console.error(`error  CameraAlert:${this.URI} and pin is ${pin}`);
        }
    }
    updateLogical(pin){
        let temp_str = "";
        let val =  this.getInputLatchVal(0);
        let pin1 = this.getInputLatchVal(1);
        if(pin === 1 && val !== 'z' && !!val && !!pin1 && !this.lastPin ){

            let data = {
                caption:"开门通知",
                value:"门被打开，是否查看视频"
            }
            let scene_module = this.getTopScene();
            let cameraId = this.getConfigVal('cameraId');
            if(cameraId !== undefined) {
                Q().then(function () {
                    //              console.log(JSON.stringify(scene_module.to_conn && scene_module.to_conn[cameraId]));
                    return async.map((scene_module.to_conn && scene_module.to_conn[cameraId]), function (cameraInfo) {
                        return this.sendDataToBus(this.URI, 'getDevConfigOfGrpName', {devInfo: cameraInfo}).then(function (devConfig) {
                            return devConfig && (devConfig.deviceSerial + ":" + devConfig.cameraNo);
                        })
                    }.bind(this))
                }.bind(this)).then(function (cameraInfo) {
                    data.extra = {
                        action: 'openCamera',
                        cameraInfo: cameraInfo,
                        actionId: this.URI,
                        actionName: ["转到回家", ""]
                    };
                    return this.sendDataToBus(this.URI, "jpush", data);
                }.bind(this)).catch(function (e) {
                    console.error('error in send jpush:', e.message || e);
                })
            }
            if(!data.extra || !data.extra.cameraInfo){
                data.extra = {
                    action: 'openURL',
                    param: this.URI
                };
                data.value ="门被打开，是否打开APP切换模式？"
            }

            data.uuid = Math.random().toPrecision(6);

            this.setOutLatchVal(0,data);
        }

        this.lastPin = pin1;
    }

}

module.exports = DoorOnOut;