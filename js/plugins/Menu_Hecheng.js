 // 备份原始方法
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    
    // 重写方法，添加自定义命令
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        // 保留原始功能（如果有）
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand("合成", "合成", true);
    };
	
	 // 为自定义命令设置处理函数
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("合成", this.commandHeCheng.bind(this));
    };
	
	// 实现自定义命令的处理逻辑
    Scene_Menu.prototype.commandHeCheng = function() {
        // 这里编写自定义功能的代码
        // 例如：打开自定义窗口、执行特定事件等
        console.log("自定义功能被调用！");
        //SceneManager.push(Scene_HeCheng); // 切换到自定义场景
		SceneManager.pop();
    };