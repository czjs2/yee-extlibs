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
        store_info.outputs = [{"type": 'object'},{"type":"object"}];

        super(store_info,manager);
    }
    setupTimer(timeout){
        let val = this.getInputLatchVal(0);
        if(val === undefined){
            val = 0;
        }
        if(this.timeHandler){
            clearInterval(this.timeHandler);
            this.timeHandler = null;
        }
        if(timeout > 0){
            let step = Math.ceil(val/(timeout/200));
            if(step === 0){
                step = 1;
            }

            this.timeHandler = setInterval(()=>{
                if(val > 0){
                    this.setOutLatchVal(1,val);
                }else{
                    val = 0;
                    this.setOutLatchVal(1,val);
                    clearInterval(this.timeHandler);
                    this.timeHandler = null;
                }
            },200);
        }
    }
    updateLogical(pin){
        if(pin === 0 ){
            let  dimTime = this.getInputLatchVal(0);
            if( dimTime && dimTime.stage2){
                this.setupTimer(dimTime.stage2);
            }else{
                this.setOutLatchVal(0,{delay:0});
                this.setOutLatchVal(1,0);
                this.setupTimer(0);
            }
        }
    }

}

module.exports = Dimmer;