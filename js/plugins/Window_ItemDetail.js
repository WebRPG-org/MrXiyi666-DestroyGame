/*:
 * @plugindesc 物品详情浮动窗口插件 (支持单列布局)
 * @author Doubao
 * @help 本插件在物品列表窗口内显示选中物品的详细信息，窗口会自动避开边界和选中项
 * 
 * @param Columns
 * @text 列数
 * @desc 物品列表的列数 (默认2列)
 * @type number
 * @min 1
 * @default 2
 */

(function() {
    // 获取插件参数
    const pluginName = 'ItemDetailWindow';
    const parameters = PluginManager.parameters(pluginName);
    const columns = Number(parameters['Columns'] || 2);

    // 定义详情窗口类
    function Window_ItemDetail() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemDetail.prototype = Object.create(Window_Base.prototype);
    Window_ItemDetail.prototype.constructor = Window_ItemDetail;

    Window_ItemDetail.prototype.initialize = function(width, height) {
        const rect = new Rectangle(0, 0, width || 320, height || 160);
        Window_Base.prototype.initialize.call(this, rect);
        this.hide();
        this.contents.fontSize = 14;
        this.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this._targetX = 0;
        this._targetY = 0;
        this._ease = 0.2;
    };

    Window_ItemDetail.prototype.setItem = function(item) {
        this._item = item;
        this.refresh();
        this.show();
    };

    Window_ItemDetail.prototype.refresh = function() {
        this.contents.clear();
        if (!this._item) return;
        
        this.drawItemName(this._item, 4, 4);
        this.drawTextEx(this._item.description, 4, 24);
    };

    Window_ItemDetail.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._targetX !== undefined) {
            this.x = this.x + (this._targetX - this.x) * this._ease;
            this.y = this.y + (this._targetY - this.y) * this._ease;
        }
    };

    // 集成到物品列表窗口
    const _Window_ItemList_initialize = Window_ItemList.prototype.initialize;
    Window_ItemList.prototype.initialize = function(x, y, width, height) {
        _Window_ItemList_initialize.call(this, x, y, width, height);
        this.createDetailWindow();
    };

    Window_ItemList.prototype.createDetailWindow = function() {
        // 详情窗口宽度设为物品窗口的60%
        const width = Math.floor(this.width * 0.6);
        this._detailWindow = new Window_ItemDetail(width, 160);
        this.addChild(this._detailWindow);
    };

    const _Window_ItemList_update = Window_ItemList.prototype.update;
    Window_ItemList.prototype.update = function() {
        _Window_ItemList_update.call(this);
        this.updateDetailWindow();
    };

    Window_ItemList.prototype.updateDetailWindow = function() {
        const index = this.index();
        if (index < 0 || !this._detailWindow) return;
        
        const item = this.itemAt(index);
        if (item) this._detailWindow.setItem(item);
        else this._detailWindow.hide();
        
        this.updateDetailPosition(index);
    };

    Window_ItemList.prototype.updateDetailPosition = function(index) {
        const rect = this.itemRect(index);
        const detail = this._detailWindow;
        const parent = this;
        
        // 物品窗口的边界信息
        const parentLeft = parent.x;
        const parentRight = parent.x + parent.width;
        const parentTop = parent.y;
        const parentBottom = parent.y + parent.height;
        
        // 计算物品在单列/双列中的位置
        const row = Math.floor(index / columns);
        const col = index % columns;
        
        // 基础位置计算（考虑列数）
        const baseX = parent.x + col * (rect.width + 8);
        const baseY = parent.y + row * rect.height;
        
        // 优先在物品右侧显示（如果有空间）
        let x = baseX + rect.width + 8;
        let y = baseY;
        
        // 如果右侧空间不足，尝试左侧
        if (x + detail.width > parentRight) {
            x = baseX - detail.width - 8;
        }
        
        // 如果左侧也不足，缩小窗口宽度
        if (x < parentLeft) {
            const availableWidth = parentRight - parentLeft - 16;
            detail.width = Math.max(200, availableWidth);
            x = baseX + rect.width + 8;  // 再次尝试右侧
            if (x + detail.width > parentRight) {
                x = baseX - detail.width - 8;  // 再次尝试左侧
            }
        }
        
        // 确保窗口不超出左右边界
        x = Math.max(parentLeft, Math.min(x, parentRight - detail.width));
        
        // 确保窗口不超出底部边界
        if (y + detail.height > parentBottom) {
            y = parentBottom - detail.height;
        }
        
        // 确保窗口不超出顶部边界
        y = Math.max(parentTop, y);
        
        // 确保不覆盖当前选中的物品
        const itemTop = baseY;
        const itemBottom = itemTop + rect.height;
        
        // 如果会覆盖物品，调整位置
        if (y < itemBottom && y + detail.height > itemTop) {
            // 尝试放在物品下方
            if (itemBottom + detail.height <= parentBottom) {
                y = itemBottom + 4;
            } 
            // 尝试放在物品上方
            else if (itemTop - detail.height >= parentTop) {
                y = itemTop - detail.height - 4;
            }
        }
        
        // 最终边界检查
        x = Math.max(parentLeft, Math.min(x, parentRight - detail.width));
        y = Math.max(parentTop, Math.min(y, parentBottom - detail.height));
        
        detail._targetX = x;
        detail._targetY = y;
    };
})();