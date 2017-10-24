/**
 * Created by zhuqizhong on 17-10-11.
 */

var Component = require('OStars/Core/Base').Component;
const _ = require('lodash');
const NotifySound = {
    STAGE1:26,
    STAGE2:29
}
/**
 *
 * 输入   {} 一个对象
 *
 */
class DoorOpenAlarm extends Component{
    constructor(store_info, manager){
        store_info.inputs = [{"type": 'object'},{"type":"logical"}];
        store_info.outputs = [{"type": 'object'},{"type":"object"}];
        store_info.config_setting =[{name:"midVal",type:"Number"},{name:"last",type:"Number"}]
        super(store_info,manager);
    }

    updateLogical(pin){
        let midVal = this.getConfigVal('midVal')||11;
        let lastSeconds = this.getConfigVal('last')||30;
        if(pin === 0 ){
            let input_val = this.getInputLatchVal(0) ;
            if(input_val !== 'z' && !!input_val){
                if(!this.timeHandler){
                    this.alarmCount = lastSeconds;
                    this.timeHandler = setInterval(()=>{
                        if(this.alarmCount > 0){
                            this.setOutLatchVal(1,false);
                            this.updateOutput();
                            this.setOutLatchVal(0,midVal+Math.random());
                            this.setOutLatchVal(1,true);
                            this.alarmCount-=3;
                        }else{
                            this.setOutLatchVal(0,midVal+Math.random());
                            this.setOutLatchVal(1,false);
                            clearInterval(this.timeHandler);
                            this.timeHandler = null;
                        }

                        this.updateOutput();

                    },3000);
                    this.setOutLatchVal(0,midVal+Math.random());
                    this.setOutLatchVal(1,true);
                }
            }else{

            }
        }else if(pin === 1){
            let input_val = this.getInputLatchVal(1) ;
            if(input_val !== 'z' && !!input_val) {
                if(this.timeHandler){
                    this.setOutLatchVal(0,midVal+Math.random());
                    this.setOutLatchVal(1,false);
                    clearInterval(this.timeHandler);
                    this.timeHandler = null;
                }

            }
        }
    }

}

module.exports = DoorOpenAlarm;