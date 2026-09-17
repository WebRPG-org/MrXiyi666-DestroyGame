//=================================================================================================
// Fun_Battle_Show.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc 战斗界面修改。
* @author 希夷先生
* @help
*/
(() => {
	
	// 重写背景创建方法
	//=================== 保存原始的 Spriteset_Battle.prototype.createBattleback 方法==========================
    const _Spriteset_Battle_createBattleback = Spriteset_Battle.prototype.createBattleback;
    Spriteset_Battle.prototype.createBattleback = function() {
        _Spriteset_Battle_createBattleback.call(this);
        // 设置远景背景透明度
        this._back1Sprite.opacity = 100;
        // 设置近景背景透明度
        this._back2Sprite.opacity = 100;
    };
	//=================== 保存原始的 Window_StatusBase.prototype.initialize 方法==========================
	const _Window_StatusBase_prototype_initialize = Window_StatusBase.prototype.initialize;
	Window_StatusBase.prototype.initialize = function(rect) {
		if (SceneManager._scene instanceof Scene_Battle) {
			rect.y = rect.y + 40;
		}
        _Window_StatusBase_prototype_initialize.call(this, rect);
    };
	//=================== 保存原始的 Window_StatusBase.prototype.placeBasicGauges 方法==========================
	const _Window_StatusBase_prototype_placeBasicGauges = Window_StatusBase.prototype.placeBasicGauges;
    Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y) {
        if (SceneManager._scene instanceof Scene_Battle) {
			this.backOpacity = 0;
			this.height = 160;
            return;
        }
		_Window_StatusBase_prototype_placeBasicGauges.call(this, actor, x, y);
    };
	//战斗界面 名字坐标修改
	//=================== 保存原始的 Window_StatusBase.prototype.placeActorName 方法==========================
	const _Window_StatusBase_prototype_placeActorName = Window_StatusBase.prototype.placeActorName;
	Window_StatusBase.prototype.placeActorName = function(actor, x, y) {
		if (SceneManager._scene instanceof Scene_Battle) {
			
            return;
        }
	    _Window_StatusBase_prototype_placeActorName.call(this, actor, x, y);
	};
	//=================== 保存原始的 Window_StatusBase.prototype.drawActorFace 方法==========================
	const _Window_StatusBase_prototype_drawActorFace = Window_StatusBase.prototype.drawActorFace;
	Window_StatusBase.prototype.drawActorFace = function(actor, x, y, width, height) {
		if (SceneManager._scene instanceof Scene_Battle) {
			this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height + 70);
            return;
        }
		_Window_StatusBase_prototype_drawActorFace.call(this, actor, x, y, width, height);
    };
	//敌人出现文本消息
	//=================== 保存原始的 BattleManager.displayStartMessages 方法==========================
	const _BattleManager_displayStartMessages = BattleManager.displayStartMessages;
    BattleManager.displayStartMessages = function() {
        // 移除敌人出现消息的循环
        // 保留先手/偷袭状态提示
		//战斗开始
        if (this._preemptive) {
            $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
        } else if (this._surprise) {
            $gameMessage.add(TextManager.surprise.format($gameParty.name()));
        }
		
    };
	//战斗结算文本消息
	//=================== 保存原始的 BattleManager.displayVictoryMessage 方法==========================
	const _BattleManager_displayVictoryMessage = BattleManager.displayVictoryMessage;
	BattleManager.displayVictoryMessage = function() {
        //$gameMessage.add(TextManager.victory.format($gameParty.name()));
		//console.log(TextManager.victory.format($gameParty.name()));
    };
	//战斗胜利 显示经验
	BattleManager.displayExp = function() {
        const exp = this._rewards.exp;
        if (exp > 0) {
            const text = TextManager.obtainExp.format(exp, TextManager.exp);
            //$gameMessage.add("\\." + text);
			
        }
    };
	// 物品窗口坐标修改
	const _Window_BattleItem_prototype_initialize = Window_BattleItem.prototype.initialize;
	Window_BattleItem.prototype.initialize = function(rect) {
		rect.height = 360;
        _Window_BattleItem_prototype_initialize.call(this, rect);
    };
	// 保存原始方法  物品窗口 一列
    const _Window_BattleItem_maxCols = Window_BattleItem.prototype.maxCols;
    Window_BattleItem.prototype.maxCols = function() {
        return 1; // 单列显示
    };
	
	
	//创建战斗准备窗口
	//=================== 保存原始的 Scene_Battle.prototype.createAllWindows 方法==========================
	const _Scene_Battle_prototype_createAllWindows= Scene_Battle.prototype.createAllWindows;
	Scene_Battle.prototype.createAllWindows = function(){
		_Scene_Battle_prototype_createAllWindows.call(this);
		this._partyCommandWindow.backOpacity = 0;
		this._partyCommandWindow.frameVisible = false;
		this._actorCommandWindow.backOpacity = 0;
		this._actorCommandWindow.frameVisible = false;
		this._skillWindow.backOpacity = 0;
		this._skillWindow.frameVisible = false;
		this._itemWindow.backOpacity = 0;
		this._itemWindow.frameVisible = false;
		this._itemWindow._helpWindow.backOpacity = 0;
		this._itemWindow._helpWindow.frameVisible = false;
		this._enemyWindow.backOpacity = 0;
		this._enemyWindow.frameVisible = false;
		this._actorCommandWindow.y = 208;
		this._skillWindow.y=100;
		this._itemWindow.y=100;
	}
	
	//战斗更新
	//=================== 保存原始的 Scene_Battle.prototype.update 方法==========================
	const _Scene_Battle_prototype_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function(){
		_Scene_Battle_prototype_update.call(this);
	};
	//角色命令窗口
	Scene_Battle.prototype.actorCommandWindowRect = function() {
        const ww = 312;
        const wh = 245;
        const wx = 500;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };
	//敌人选择窗口
    Scene_Battle.prototype.enemyWindowRect = function() {
        const wx = this._statusWindow.x;
        const ww = 808;//this._statusWindow.width;
        const wh = this.windowAreaHeight();
        const wy = 450;//Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };
	//队伍命令窗口
	Scene_Battle.prototype.partyCommandWindowRect = function() {
        const ww = 312;
        const wh = 115;
        const wx = 500;
        const wy = 340;
        return new Rectangle(wx, wy, ww, wh);
    };
	//技能选择窗口
	Scene_Battle.prototype.skillWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = 312;//this.windowAreaHeight();
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };
})();