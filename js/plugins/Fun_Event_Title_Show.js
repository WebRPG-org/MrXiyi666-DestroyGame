//=================================================================================================
// Fun_Event_Title_Show.js
//=================================================================================================
/*:
 * @target MZ
 * @plugindesc 地图上任意事件头顶显示名字。
 * @author 希夷先生
 *
 * @help
 * 插件功能：在地图上的事件头顶显示自定义名字
 * 
 * 使用方法：
 * 1. 在事件中插入脚本命令调用插件功能
 * 2. 可通过插件命令控制名字的显示与隐藏
 * 
 * 插件命令：
 * 1. 打开名字 - 打开当前事件的名字显示
 * 2. 关闭名字 - 关闭当前事件的名字显示
 * 3. 关闭指定编号名字 - 关闭指定事件ID的名字显示
 * 4. 修改指定编号名字 - 修改指定事件ID的名字内容
 * 
 * @command 打开名字
 * @text 打开名字
 * @desc 打开当前事件的名字显示
 * 
 * @command 关闭名字
 * @text 关闭名字
 * @desc 关闭当前事件的名字显示
 * 
 * @command 关闭指定编号名字
 * @text 关闭指定编号名字
 * @desc 关闭指定事件ID的名字显示
 * 
 * @arg id
 * @text 事件ID
 * @desc 要关闭名字显示的事件ID (0=玩家)
 * @type number
 * @min 0
 * @default 0
 * 
 * @command 修改指定编号名字
 * @text 修改指定编号名字
 * @desc 修改指定事件ID的名字显示内容
 * 
 * @arg id
 * @text 事件ID
 * @desc 要修改名字的事件ID
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg data
 * @text 名字内容
 * @desc 要显示的名字文本内容
 * @type string
 * @default 事件名称
*/
(() => {
    //创建一个精灵用于显示内容
	function Event_Name_Title(event) {
        this.initialize(event);
    };

    Event_Name_Title.prototype = Object.create(Sprite.prototype);
    Event_Name_Title.prototype.constructor = Event_Name_Title;
	
	//初始化设置
    Event_Name_Title.prototype.initialize = function(event) {
	    Sprite.prototype.initialize.call(this);
		this.event = event;
		this.text = event.event().name;
		this.id = event.eventId();
		this.bitmap = new Bitmap(0, 0);
		this.bitmap.fontFace = $gameSystem.mainFontFace();
        this.bitmap.fontSize = $gameSystem.mainFontSize();
		this.bitmap.outlineColor = ColorManager.outlineColor();
		this.bitmap.textColor = ColorManager.normalColor();
		this.bitmap.smooth = true;
		this.bitmap.outlineWidth = 3;
		this.bitmap.paintOpacity = 255;
		this.refresh();
    }
	
	Event_Name_Title.prototype.refresh = function() {
		this.bitmap.clear();
		if(!$gameSystem._event_title.for_show){
			//如果开关为关闭 则代码不执行
			return;
		}
		this.bitmap.resize(this.bitmap.measureTextWidth(this.text), $gameSystem.mainFontSize());
		this.bitmap.drawText(this.text, 0, 0, this.bitmap.width, this.bitmap.height, "center");
		this.width = this.bitmap.width;
		this.height = this.bitmap.height;
		//修改自身坐标为宽度的一半 高度在事件顶部
		this.move(0-this.width/2, 0-this.height*2.8);
	};
	//清除当前事件文本内容
	Event_Name_Title.prototype.clear = function() {
		this.bitmap.clear();
	};
	//设置新的文本内容
	Event_Name_Title.prototype.setText = function(_text) {
		this.text = _text;
		this.refresh();
	};
	
	PluginManager.registerCommand('Fun_Event_Title_Show', '打开名字', () => {
        $gameSystem._event_title.for_show = true;
		for(let _data_id of _array){
			_data_id.refresh();
		}
    });

    PluginManager.registerCommand('Fun_Event_Title_Show', '关闭名字', () => {
	    $gameSystem._event_title.for_show = false;
		for(let _data_id of _array){
			_data_id.refresh();
		}
    });
	
	PluginManager.registerCommand('Fun_Event_Title_Show', '关闭指定编号名字', args => {
		if(args.id<=0){
			return;
		}
		//遍历到指定精灵 并且清除
		for(let _data of _array){
			if(_data.id == parseInt(args.id)){
				_data.clear();
				return;
			}
		}
    });
	PluginManager.registerCommand('Fun_Event_Title_Show', '修改指定编号名字', args => {
		if(args.id<=0){
			return;
		}
		//遍历到指定精灵 设置文本
		for(let _data of _array){
			if(_data.id == args.id){
				_data.setText(String(args.data));
				return;
			}
		}
    });
	let _array = [];//所有事件的精灵数组
	//=============================存档功能======================================
    const _Game_System_initialize = Game_System.prototype.initialize;
	// 2. 重写初始化方法，声明自定义属性
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._event_title = { for_show: true }; //保存打开关闭功能到当前存档
    };
	const _Spriteset_Map_prototype_createCharacters = Spriteset_Map.prototype.createCharacters;
	Spriteset_Map.prototype.createCharacters = function() {
		_array.length = 0;//初始化数组
		_Spriteset_Map_prototype_createCharacters.call(this);
	};
	//=============================初始化事件精灵======================================
	const _Sprite_Character_prototype_setCharacter = Sprite_Character.prototype.setCharacter;
	Sprite_Character.prototype.setCharacter = function(character) {
		_Sprite_Character_prototype_setCharacter.call(this, character);
		if (!(character instanceof Game_Event)) {
			//判断是否为事件 如果不是则返回
		    return;
		}
		let _data = new Event_Name_Title(character);
		_array.push(_data);//保存精灵的引用
		this.addChild(_data);//添加精灵到当前事件
    };
})();