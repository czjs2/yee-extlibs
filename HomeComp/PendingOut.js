/**
 * Created by zhuqizhong on 17-10-10.
 */
/**
 * Created by Administrator on 2016/8/24.
 */
/**
 *  超链接功能
 */

var Component = require('OStars/Core/Base').Component;

const OUT_PIN ={
    S:0,
    P_S:1,
    END:2
}
/**
 * 创建一个DataWatchItem
 * @param store_info
 * @param manager
 * @constructor
 *
 * input  s start_set   启动
 *        rst reset  清除
 *        set          强制结束
 *
 *
 * output:    p       输出控制信息
 *            p_s     当前是否正在pending状态
 *            end     结束，输出1
 *
 */
class PendingOut extends Component{
    constructor(store_info, manager){
        store_info.inputs = [{"type": 'object'},{"type": 'object'},{"type": 'object'}];
        store_info.outputs = [{"type": 'object'},{"type": 'object'},{"type": 'object'}];
        store_info.config_setting = [{name: 'Stage1Delay', type: 'number'},{name: 'Stage2Delay', type: 'number'}]
        super(store_info,manager);
        this.setOutLatchVal(OUT_PIN.S,{});
        this.setOutLatchVal(OUT_PIN.P_S,false);
        this.setOutLatchVal(OUT_PIN.END,false);
    }
    setEndPulse(){
        this.setOutLatchVal(OUT_PIN.END,true);
        this.setOutLatchVal(OUT_PIN.P_S,false);
        setTimeout(()=>{this.setOutLatchVal(OUT_PIN.END,false),500});
    }
    updateLogical(pin){
        if(pin === 0 ){
            let pin0 = this.getInputLatchVal(0);
            if(pin0 !== 'z' && !!pin0 && !this.last_pin){
                let timer = parseInt(this.getConfigVal('Stage1Delay') || 0 ) +  parseInt(this.getConfigVal('Stage2Delay') || 0 );
                if(this.timerHandler){
                    clearTimeout(this.timerHandler);
                }
                this.timerHandler = setTimeout(()=>{
                    this.setOutLatchVal(OUT_PIN.S,{});
                    this.setOutLatchVal(OUT_PIN.P_S,false);
                    this.setEndPulse();
                    this.timerHandler = null;
                    this.updateOutput();
                },timer);
                this.setOutLatchVal(OUT_PIN.S,{stage1:this.getConfigVal('Stage1Delay'),stage2:this.getConfigVal('Stage2Delay')||0,uuid:Math.random().toFixed(8)});
                this.setOutLatchVal(OUT_PIN.P_S,true);
            }
            this.last_pin = pin0;
        }else if(pin === 1 && !this.getInputLatchVal(1)){ //reset
            setTimeout(()=>{
                this.setOutLatchVal(OUT_PIN.S,{});
                this.setOutLatchVal(OUT_PIN.P_S,false);
                if(this.timerHandler){
                    clearTimeout(this.timerHandler);
                    this.timerHandler = null;
                }
                this.updateOutput();
            },20); //延时500ms输出，防止输入的脉冲还在


        }
        else if(pin === 2){ //强制set
            let val =  this.getInputLatchVal(2);
            if(val !== undefined && val !== 'z' && !!val&& !this.last_pin2){
                this.setOutLatchVal(OUT_PIN.S,{});
                this.setOutLatchVal(OUT_PIN.P_S,false);
                this.setEndPulse();
                if(this.timerHandler){
                    clearTimeout(this.timerHandler);
                    this.timerHandler = null;
                }

            }
            this.last_pin2 = val;
        }
    }

}

module.exports = PendingOut;




