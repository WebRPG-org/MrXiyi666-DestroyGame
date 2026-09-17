//=================================================================================================
// Fun_Practice_Status_Show.js
//=================================================================================================
/*:
 * @target MZ
 * @plugindesc 挂机修行 地图上显示状态信息。
 * @author 希夷先生
 *
 * @help
 * 插件功能：适用于挂机游戏 自动增加经验值 地图上可以显示状态栏
 *
 * @command 打开窗口
 * @text 打开窗口
 * @desc 打开状态信息窗口
 *
 * @command 关闭窗口
 * @text 关闭窗口
 * @desc 关闭状态信息窗口
 * 
*/
(()=>{
	let _Runs_Game = false;
	// 自定义对话窗口
    function Window_Practice_Status() {
        this.initialize(...arguments);
    };

    Window_Practice_Status.prototype = Object.create(Window_Base.prototype);
    Window_Practice_Status.prototype.constructor = Window_Practice_Status;

    // 初始化窗口
    Window_Practice_Status.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
	
	Window_Practice_Status.prototype.refresh = function(){
		this.contents.clear();
		let _data_zero = $gameParty.members()[0].name() + " Lv." + $gameParty.members()[0].level;
		let hp = $gameParty.members()[0].hp;
		let mhp = $gameParty.members()[0].mhp;
		let _data_two = "生命值：" + hp + "/" + mhp;
		let mp = $gameParty.members()[0].mp;
		let mmp = $gameParty.members()[0].mmp;
		let _data_three = "灵力值：" + mp + "/" + mmp;
		let _data_four = "经验值：" + $gameParty.members()[0].currentExp() + "/" + $gameParty.members()[0].nextLevelExp();
		this.drawText(_data_zero , 8, 5, this.contents.measureTextWidth(_data_zero), "center");
		this.drawText(_data_two, 8, 40, this.contents.measureTextWidth(_data_two), "center");
		this.drawText(_data_three, 8, 75, this.contents.measureTextWidth(_data_three), "center");
		this.drawText(_data_four, 8, 110, this.contents.measureTextWidth(_data_four), "center");
	};
	
	Window_Practice_Status.prototype.update = function(){
		this.refresh();
	};
	const _SceneManager_isGameActive = SceneManager.isGameActive;
	SceneManager.isGameActive = function() {
	    if(_Runs_Game){
		    return true;
	    }
	    return _SceneManager_isGameActive.call(this);
    };
	let _Scene_Map=null;
	//Scene_Map 地图创建窗口功能
	const _Scene_Map_prototype_createAllWindows = Scene_Map.prototype.createAllWindows;
	Scene_Map.prototype.createAllWindows = function() {
		_Scene_Map_prototype_createAllWindows.call(this);
		_Scene_Map = this;
		_Runs_Game = false;
		_Scene_Map.addChild(new Window_Practice_Status(new Rectangle(10, 10, 280, 178)));
		for(const child of _Scene_Map.children){
			if(child instanceof Window_Practice_Status){
				child.hide();
			}
		}
	};
	
	PluginManager.registerCommand('Fun_Practice_Status_Show', '打开窗口', () => {
		_Runs_Game = true;
		for(const child of _Scene_Map.children){
			if(child instanceof Window_Practice_Status){
				child.show();
			}
		}
        
    });

    PluginManager.registerCommand('Fun_Practice_Status_Show', '关闭窗口', () => {
		_Runs_Game = false;
	    for(const child of _Scene_Map.children){
			if(child instanceof Window_Practice_Status){
				child.hide();
			}
		}
    });
	
})();