/**
 * Created by zhuqizhong on 17-10-11.
 */

var Component = require('OStars/Core/Base').Component;
const _ = require('lodash');
/**
 *
 * 输入   {} 一个对象
 *
 */
class Alarmer extends Component{

    constructor(store_info, manager){
        store_info.inputs = [{"type": 'object'},{"type": 'logical'}];
        store_info.outputs = [{"type": 'object'},{"type":"object"}];
        store_info.config_setting =[{name:"SoundDelay",type:"Number"},{name:"midVal",type:"Number"}]
        super(store_info,manager);
    }
    startSound(){
        if(this.timeHandler){
            clearTimeout(this.timeHandler);
            this.timeHandler = null;
        }
        this.timeHandler = setTimeout(()=>{
            this.setOutLatchVal(1,false);
            this.timeHandler = null;
            this.updateOutput(0,undefined);

        },this.getConfigVal('SoundDelay') || 30000);
        this.setOutLatchVal(0,this.getConfigVal('midVal') || 1);
        this.setOutLatchVal(1,true);
    }
    stopSound(){
        if(this.timeHandler){
            clearTimeout(this.timeHandler);
            this.timeHandler = null;
        }
        this.setOutLatchVal(0,undefined);
        this.setOutLatchVal(1,false);
        this.timeHandler = null;
    }

    updateLogical(pin){
        if(pin === 0 ){
            let pin_val = this.getInputLatchVal(0);
            if(pin_val && pin_val !== 'z'){
                this.startSound();
            }

        }else if(pin === 1){
            if(this.getInputLatchVal(1) !== 'z' && this.getInputLatchVal(1)){
                this.stopSound();
            }
        }
    }

}

module.exports = Alarmer;