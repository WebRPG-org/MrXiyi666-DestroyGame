//=================================================================================================
// Fun_Actor_Title_Show.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc 地图上主角头顶显示称号。
* @author 希夷先生
* @help
 *
 * @command 打开称号
 * @text 打开称号
 * @desc 打开称号文本
 * 
 * @command 关闭称号
 * @text 关闭称号
 * @desc 关闭称号文本
 *
*/

(() => {
	//创建一个精灵用于显示内容
	function Actor_Name_Title() {
        this.initialize();
    };

    Actor_Name_Title.prototype = Object.create(Sprite.prototype);
    Actor_Name_Title.prototype.constructor = Actor_Name_Title;
	
	//初始化设置
    Actor_Name_Title.prototype.initialize = function() {
	    Sprite.prototype.initialize.call(this);
		this.bitmap = new Bitmap(this.width, this.height);
		this.bitmap.fontFace = $gameSystem.mainFontFace();
        this.bitmap.fontSize = $gameSystem.mainFontSize();
		this.bitmap.outlineColor = ColorManager.outlineColor();
		this.bitmap.textColor = ColorManager.normalColor();
		this.bitmap.smooth = true;
		this.bitmap.outlineWidth = 3;
		this.bitmap.paintOpacity = 255;
		this.refresh();
		
    }
	
	Actor_Name_Title.prototype.refresh = function() {
		this.bitmap.clear();
		if(!$gameSystem._actor_title.for_show){
			//如果开关为关闭 则代码不执行
			return;
		}
		this.text = $gameParty.leader().nickname();
		this.bitmap.resize(this.bitmap.measureTextWidth(this.text), $gameSystem.mainFontSize());
		this.bitmap.drawText(this.text, 0, 0, this.bitmap.width, this.bitmap.height, "center");
		this.width = this.bitmap.width;
		this.height = this.bitmap.height;
		this.move(0-this.width/2, 0-this.height*2.8);
	};
	
	
	//================================== 注册插件指令===========================
    PluginManager.registerCommand('Fun_Actor_Title_Show', '打开称号', () => {
		$gameSystem._actor_title.for_show = true;
		for(let _data of _array){
		    _data.refresh();	
		}
    });

    PluginManager.registerCommand('Fun_Actor_Title_Show', '关闭称号', () => {
		$gameSystem._actor_title.for_show = false;
		for(let _data of _array){
		    _data.refresh();	
		}
    });
	
	//=============================存档功能======================================
    const _Game_System_initialize = Game_System.prototype.initialize;
	// 2. 重写初始化方法，声明自定义属性
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._actor_title = { data: "", for_show: true }; // 初始化自定义属性（避免 undefined）
    };
	
	let _array = [];//所有事件的精灵数组
	const _Spriteset_Map_prototype_createCharacters = Spriteset_Map.prototype.createCharacters;
	Spriteset_Map.prototype.createCharacters = function() {
		_array.length = 0;//初始化数组
		_Spriteset_Map_prototype_createCharacters.call(this);
	};
	
	const _Sprite_Character_prototype_setCharacter = Sprite_Character.prototype.setCharacter;
	Sprite_Character.prototype.setCharacter = function(character) {
        _Sprite_Character_prototype_setCharacter.call(this, character);
		if (!(character instanceof Game_Player)) {
			//判断是否为角色 如果不是则返回
		    return;
		}
		let _data = new Actor_Name_Title();
		_array.push(_data);//保存精灵的引用
		this.addChild(_array[_array.length-1]);//添加精灵到当前事件
    };
    const _Game_Interpreter_prototype_command324 = Game_Interpreter.prototype.command324;
    Game_Interpreter.prototype.command324 = function(params) {
	    _Game_Interpreter_prototype_command324.call(this, params);
		for(let _data of _array){
		    _data.refresh();	
		}
        return true;	
	};
})();