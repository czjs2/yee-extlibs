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
class SoundMaker extends Component{
    constructor(store_info, manager){
        store_info.inputs = [{"type": 'object'}];
        store_info.outputs = [{"type": 'object'},{"type":"object"}];
        store_info.config_setting =[{name:"alarmType",type:"string"},{name:"interval",type:"Number"}]
        super(store_info,manager);
    }
    setupTimer(stage1,stage2){
        let val = stage1+stage2;
      //  val = 1000000;
        if(val === undefined){
            val = 0;
        }
        if(this.timeHandler){
            clearInterval(this.timeHandler);
            this.timeHandler = null;
        }
        let timeout = (stage1 || 0 )+ (stage2 || 0);
        let alarmType = this.getConfigVal('alarmType') || 'leave'
        if(timeout > 0){

            let step = Math.ceil(val/(timeout/(this.getConfigVal('interval')||1000)));
            if(step === 0){
                step = 1;
            }

          //  let i = 0;
            this.setOutLatchVal(1,true);
            this.timeHandler = setInterval(()=>{
                if(val > 0){
                    if(val > stage2){
                        this.setOutLatchVal(0,1);


                    }else{
                        this.setOutLatchVal(0,8);
                    }

                }else{
                    val = 0;
                    this.setOutLatchVal(1,false);
                   // this.setOutLatchVal(0,0);
                    clearInterval(this.timeHandler);
                    this.timeHandler = null;
                }
                val-= step;
            },1000);
        }
    }
    updateLogical(pin){
        if(pin === 0 ){
            let input_val = this.getInputLatchVal(0) ||{};
            if(_.isEmpty(input_val)){
                //this.setOutLatchVal(0,0);
                this.setOutLatchVal(1,false);
                this.setupTimer(0)
            }else{
                this.setupTimer(input_val.stage1,input_val.stage2);
            }
        }
    }

}

module.exports = SoundMaker;