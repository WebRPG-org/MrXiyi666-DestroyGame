//=================================================================================================
// Fun_Item_Help_Show.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc 菜单物品栏显示详细信息。
* @author 希夷先生
* @help
*/
(()=>{
	// 自定义窗口
    function Window_Item_Help() {
        this.initialize(...arguments);
    };

    Window_Item_Help.prototype = Object.create(Window_Base.prototype);
    Window_Item_Help.prototype.constructor = Window_Item_Help;

    // 初始化窗口
    Window_Item_Help.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.contents.fontSize = 20;
		this.frameVisible = true;
		this._data_y=this.height;
		this._gundong_sudu = 0;
		if (SceneManager._scene instanceof Scene_Battle) {
            this.backOpacity = 0;
		    this.frameVisible = false;
        }
    };
	Window_Item_Help.prototype._data_y_gundong = function(height){
		if(this._data_y > -height){
			if(this._data_y > this.height / 2){
				this._data_y= this._data_y-2;
				return;
			}
			this._data_y--;
		}else{
			this._data_y = this.height;
		}
		
	};
	//画出内容
	Window_Item_Help.prototype.refresh = function(item_data){
		this.contents.clear();
		let _data_zero = item_data.description.split("");
		let _data_note = item_data.note.split("\n");
		let _data_description=[];
		let _xu_data="";
		let _height_id=0;
		let _data_height=0;
		for(let _data of _data_zero){
			if(this.contents.measureTextWidth(_xu_data) > this.width - 45){
				_data_description.push(_xu_data);
				_xu_data="";
			}
			_xu_data+=_data;
		}
		_data_description.push(_xu_data);
		this.changeTextColor("rgba(255, 255, 0, 1)");
		this.drawText("说明：", 0, this._data_y, this.contents.measureTextWidth("说明："));
		this.changeTextColor(ColorManager.normalColor());
		_data_height+=30;
		for(let _data of _data_description){
			_data_height+=30;
			this.drawText(_data, 0, this._data_y + 25 * _height_id + 25, this.contents.measureTextWidth(_data));
			_height_id = _height_id+1;
		}
		this.changeTextColor("rgba(255, 255, 0, 1)");
		this.drawText("属性：", 0, this._data_y + 25 * _height_id + 25, this.contents.measureTextWidth("属性："));
		this.changeTextColor(ColorManager.normalColor());
		_data_height+=30;
		for(let _data of _data_note){
			_height_id = _height_id+1;
			_data_height+=30;
			this.drawText(_data, 0, this._data_y + 25 * _height_id + 25, this.contents.measureTextWidth(_data));
		}
		this._data_y_gundong(_data_height);
	};
	//初始化
    const _Window_ItemList_prototype_initialize = Window_ItemList.prototype.initialize;
    Window_ItemList.prototype.initialize = function(rect) {
		rect.height = rect.height + 95;
		rect.width = rect.width / 2;
		_Window_ItemList_prototype_initialize.call(this, rect);
        this._Item_backup_y = -1100;
		this._Item_backup_x = -1100;
	};
	
	const _Window_ItemList_prototype_maxCols = Window_ItemList.prototype.maxCols;
	Window_ItemList.prototype.maxCols = function() {
        return 1;
    };
	const _Window_ItemList_prototype_processCancel = Window_ItemList.prototype.processCancel;
	Window_ItemList.prototype.processCancel = function() {
		for(let child of this.children){
			if (child instanceof Window_Item_Help) {
				 this.removeChild(child);
			}
		}
		this._Item_backup_y=-1100;
		this._Item_backup_x=-1100;
		_Window_ItemList_prototype_processCancel.call(this);
	};
	const _Window_ItemList_prototype_update = Window_ItemList.prototype.update;
	Window_ItemList.prototype.update = function() {
        _Window_ItemList_prototype_update.call(this);
        // 在 update 方法中获取坐标信息
        const rect = this.itemRect(this.index());
		if(!this.item()){
			for(let child of this.children){
			    if (child instanceof Window_Item_Help) {
			        this.removeChild(child);
			    }
		    }
			this._Item_backup_y=-1100;
			this._Item_backup_x=-1100;
			return;
		}
		for(let child of this.children){
			if (child instanceof Window_Item_Help) {
				child.refresh(this.item());
			}
		}
        if(this._Item_backup_y == rect.y && this._Item_backup_x == rect.x){
			return;
		}
		for(let child of this.children){
			if (child instanceof Window_Item_Help) {
			    this.removeChild(child);
			}
		}
		this.addChild(new Window_Item_Help(new Rectangle(this.width, 0, this.width, this.height)));
		this._Item_backup_y = rect.y;
		this._Item_backup_x = rect.x;
    };
	
	const _Scene_Item_prototype_onCategoryOk = Scene_Item.prototype.onCategoryOk;
	Scene_Item.prototype.onCategoryOk = function() {
		_Scene_Item_prototype_onCategoryOk.call(this);
    };
	const _Scene_Item_prototype_onItemCancel = Scene_Item.prototype.onItemCancel;
	Scene_Item.prototype.onItemCancel = function() {
		_Scene_Item_prototype_onItemCancel.call(this);
    };
	const _Scene_MenuBase_prototype_createHelpWindow = Scene_MenuBase.prototype.createHelpWindow;
	Scene_MenuBase.prototype.createHelpWindow = function() {
		_Scene_MenuBase_prototype_createHelpWindow.call(this);
        this._helpWindow.hide();
    };
	const _Window_EquipStatus_prototype_initialize = Window_EquipStatus.prototype.initialize;
	Window_EquipStatus.prototype.initialize = function(rect) {
	
		rect.height = rect.height + 95;
        _Window_EquipStatus_prototype_initialize.call(this, rect);
    };
	
	Window_EquipStatus.prototype.refresh = function() {
    this.contents.clear();
        if (this._actor) {
            const nameRect = this.itemLineRect(0);
            //this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);
            this.drawActorFace(this._actor, nameRect.x, 0);
            this.drawAllParams();
        }
    };
	Window_EquipStatus.prototype.drawAllParams = function() {
        for (let i = 0; i < 6; i++) {
            const x = this.itemPadding();
            const y = this.paramY(i) - 40;
            this.drawItem(x, y, 2 + i);
        }
    };
	const _Window_EquipSlot_prototype_initialize = Window_EquipSlot.prototype.initialize;
	Window_EquipSlot.prototype.initialize = function(rect) {
		rect.height = rect.height+95;
        _Window_EquipSlot_prototype_initialize.call(this, rect);
    };
	const _Window_ItemCategory_prototype_initialize = Window_ItemCategory.prototype.initialize
	Window_ItemCategory.prototype.initialize = function(rect) {
		rect.width = rect.width/2;
        _Window_ItemCategory_prototype_initialize.call(this, rect);
    };
	const _Window_ItemCategory_prototype_maxCols = Window_ItemCategory.prototype.maxCols;
	Window_ItemCategory.prototype.maxCols = function() {
        _Window_ItemCategory_prototype_maxCols.call(this);
		return 3;
    };
	Window_ItemCategory.prototype.makeCommandList = function() {
    if (this.needsCommand("item")) {
        this.addCommand(TextManager.item, "item");
    }
    if (this.needsCommand("weapon")) {
        this.addCommand(TextManager.weapon, "weapon");
    }
    if (this.needsCommand("armor")) {
        this.addCommand("宠物", "armor");
    }
    if (this.needsCommand("keyItem")) {
        this.addCommand(TextManager.keyItem, "keyItem");
    }
};
})();