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

function extractSceneId(uri) {
    if (uri)
        return uri.match(/([^:]*):(.*)/i, "$1");
}
/**
 * 创建一个DataWatchItem
 * @param store_info
 * @param manager
 * @constructor
 */
class PendingSleep extends Component{
    constructor(store_info, manager){
        store_info.inputs = [{"type": 'object'},{"type": 'object'}];
        store_info.outputs = [{"type": 'object'},{"type": 'object'}];
        store_info.config_setting = [{name: 'Stage1Delay', type: 'number'},{name: 'Stage2Delay', type: 'number'}]
        super(store_info,manager);
        
    }
    updateLogical(pin){
        if(pin === 0 ){
            let pin0 = this.getInputLatchVal(0);
            if(pin0 !== 'z' && pin0 && !this.last_pin){
                let timer = parseInt(this.getConfigVal('Stage1Delay') || 0 ) +  parseInt(this.getConfigVal('Stage2Delay') || 0 );
                if(this.timerHandler){
                    clearTimeout(this.timerHandler);
                }
                this.timerHandler = setTimeout(()=>{
                    this.setOutLatchVal(0,0);
                    this.setOutLatchVal(1,true);
                    this.timerHandler = null;
                    this.updateOutput();
                },timer);
                this.setOutLatchVal(0,{stage1:this.getConfigVal('Stage1Delay'),stage2:this.getConfigVal('Stage2Delay')});
            }else if(!pin0){
                if(this.timerHandler){
                    clearTimeout(this.timerHandler);
                    this.timerHandler = null;
                }
                this.setOutLatchVal(1,false);
                this.setOutLatchVal(0,0);
            }
            this.last_pin = pin0;
        }else if(pin === 1){
            this.setOutLatchVal(0,0);
            if(this.timerHandler){
                clearTimeout(this.timerHandler);
                this.timerHandler = null;
            }
            this.setOutLatchVal(1,false);
        }
    }

}

module.exports = PendingSleep;




