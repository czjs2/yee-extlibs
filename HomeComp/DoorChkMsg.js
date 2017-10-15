/**
 * Created by zhuqizhong on 17-10-11.
 */

var Component = require('OStars/Core/Base').Component;
/**
 *
 */
class Dimmer extends Component{
    constructor(store_info, manager){
        store_info.inputs = [{"type": 'object'},{"type": 'object'}];
        store_info.outputs = [{"type": 'object'}];

        super(store_info,manager);
    }

    updateLogical(pin){
        let temp_str = "";
        let val = this.getInputLatchVal(0);
        if(pin === 0 &&  val !== 'z' && !!val && !this.lastPin){
            let doorState = this.getInputLatchVal(1);
            if( doorState !== undefined && !doorState){
                temp_str = "，门未关上";
            }
            let msg = `启动离家模式，电器、灯光已经关闭，安防已经启动${temp_str}`;
            if(temp_str){
                this.setOutLatchVal(0,{caption:'启动离家模式',value:msg,uuid:Math.random().toPrecision(6)});
            }else{
                this.setOutLatchVal(0,{caption:'启动离家模式',value:msg,uuid:Math.random().toPrecision(6)});
            }
        }
        this.lastPin = val;

    }

}

module.exports = Dimmer;