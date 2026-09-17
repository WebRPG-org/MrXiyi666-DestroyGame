//=============================================================================
// Fun_Actor_Battler_Information.js
//=============================================================================
/*:
* @target MZ
* @plugindesc 战斗场景显示主角详细信息
* @author 希夷先生
*/
(() => {
	//定义血条
    function Actor_Battler_Information() {
        this.initialize.apply(this, arguments)
    }
    Actor_Battler_Information.prototype = Object.create(Sprite.prototype);
    Actor_Battler_Information.prototype.constructor = Actor_Battler_Information;
    //==============================
    //初始化设置
    Actor_Battler_Information.prototype.initialize = function(actor, width, height) {
	    Sprite.prototype.initialize.call(this);
		this.width = width;
		this.height = height;
		this.frome_height = 22;
		this.bitmap = new Bitmap(this.width, this.height);
		this.bitmap.fontFace = $gameSystem.mainFontFace();
        this.bitmap.fontSize = 18;//$gameSystem.mainFontSize();
		this.bitmap.outlineColor = ColorManager.outlineColor();
		this.bitmap.textColor = ColorManager.normalColor();
		this.bitmap.smooth = true;
		this.bitmap.outlineWidth = 3;
		this.bitmap.paintOpacity = 255;
		this._actor = actor;
		this.move(160, 8);
		
    }
	
	Actor_Battler_Information.prototype.refresh = function() {
		this.bitmap.clear();
		this.bitmap.fillAll(ColorManager.outlineColor());
		let x=10;
		let y=10;
		//百分比计算
		let rect_width = this.width - 90;
		let hp_rect_width = (this._actor.hp / this._actor.mhp) * rect_width;
		let mp_rect_width = (this._actor.mp / this._actor.mmp) * rect_width;		
		this.bitmap.fillRect(80, this.frome_height*2 + y, hp_rect_width, this.frome_height, "rgba(255, 0, 0, 1)");
		this.bitmap.fillRect(80, this.frome_height*3+ 5 + y, mp_rect_width, this.frome_height, "rgba(73, 151, 208, 1)");
		this.bitmap.drawText(this._actor.name(), 0, y, this.width, this.frome_height, "center");
		this.bitmap.drawText("生命值：", x, this.bitmap.fontSize*2 + 11 + y, this.width, this.bitmap.fontSize, "left");
		this.bitmap.drawText("灵力值：", x, this.bitmap.fontSize*3 + 20 + y, this.width, this.bitmap.fontSize, "left");
		this.bitmap.drawText(this._actor.hp + "/" + this._actor.mhp, x, this.bitmap.fontSize*2 + 11 + y, this.width, this.bitmap.fontSize, "center");
		this.bitmap.drawText(this._actor.mp + "/" + this._actor.mmp, x, this.bitmap.fontSize*3 + 20 + y, this.width, this.bitmap.fontSize, "center");
	}
	
	Actor_Battler_Information.prototype.update = function() {
		this.refresh();
	}
	const _Window_StatusBase_prototype_placeBasicGauges = Window_StatusBase.prototype.placeBasicGauges;
	Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y) {
		_Window_StatusBase_prototype_placeBasicGauges.call(this, actor, x, y);
	    if (!(SceneManager._scene instanceof Scene_Battle)) {
		    return;
		}
		for (const child of this.children) {
            if (child instanceof Actor_Battler_Information) {
                this.removeChild(child);
           }
        }
		this.addChild(new Actor_Battler_Information(actor, this.width+20, this.height-16));
	};
	
	Scene_Battle.prototype.updateStatusWindowPosition = function() {
   
    };
})();