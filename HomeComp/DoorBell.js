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
class DoorBell extends Component{
    constructor(store_info, manager){
        store_info.inputs = [{"type": 'object'}];
        store_info.outputs = [{"type": 'object'},{"type":"object"}];
        store_info.config_setting =[{name:"midVal",type:"Number"}]
        super(store_info,manager);
    }

    updateLogical(pin){
        if(pin === 0 ){
            let input_val = this.getInputLatchVal(0) ;
            if(input_val){
                if(!this.timeHandler){
                    this.timeHandler = setTimeout(()=>{
                        this.setOutLatchVal(0,10+Math.random());
                        this.setOutLatchVal(1,false);
                        this.updateOutput();
                        this.timeHandler = null;
                    },4000);

                    this.setOutLatchVal(0,10+Math.random());
                    this.setOutLatchVal(1,true);
                }
            }else{

            }
        }
    }

}

module.exports = DoorBell;