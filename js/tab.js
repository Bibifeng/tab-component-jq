/**
 * (function(paramA){...})(b);(匿名函数在js中因为也是对象,所以需要双括号包裹起来)
 * 这个结构就说明了,我使用了匿名函数,并且立刻执行这个匿名函数
 * 再分析(function(paramA){...})(b)这种格式,匿名函数部分参数paramA是个形参,用在匿名函数内部作为值的调用,而b这个参数就是个实参,是将b这个值代入到函数内部.
 * **/
;(function($) {

    var Tab=function (tab) {
        var _this_=this;
        //保存单个tab组建
        this.tab=tab;
        //默认配置参数
        this.config={
            //定义鼠标的触发类型，如click或者mouseover
            "triggerType":"mouseover",
            //定义切换效果，如淡入淡出或者直接切换
            "effect":"default",
            //默认显示第几个TAB
            "invoke":1,
            //用来定义TAB是否自动切换，后面表示时间间隔，默认为不切换
            "auto":false
        };
//如果配置参数存在，则替换（扩展）掉默认参数
        if(this.getConfig()){
            $.extend(this.config,this.getConfig());
        };

        //保存tab标签列表，以及保存对应的内容列表（即下面的内容区域）
        this.tabItems=this.tab.find("ul.tab-nav li");
        this.contentItems=this.tab.find("div.content-wrap div.content-item");

        //保存配置参数
        var config=this.config;
        if(config.triggerType==="click"){
            this.tabItems.bind(config.triggerType,function () {
                _this_.invoke($(this));
            })
        }else if(config.triggerType==="mouseover" ||config.triggerType!="click"){
            this.tabItems.mouseover(function () {
                var self=$(this);
                this.timer=window.setTimeout(function () {
                    _this_.invoke(self);
                },300);

            }).mouseout(function () {
               window.clearTimeout(this.timer);
            });

        };

    //自动切换功能
        if(config.auto){
            //定义一个全局的定时器
            this.timer=null;
            //定义一个计数器，
            this.loop=0;

            this.autoPlay();

            /**
             * 当鼠标停留在tab内容区域时
             * 停止自动切换
             * 离开内容区域，autoPlay（）重新执行
             * 若触发条件为mouseover，会有bug
             * **/
            // this.tab.hover(function () {
            //     window.clearInterval(_this_.timer)
            // },function () {
            //     _this_.autoPlay();
            // });

        };

        //设置默认显示第几个tab
        if(config.invoke>1){
            this.invoke(this.tabItems.eq(config.invoke-1));
        };

    };

    Tab.prototype={

        //自动间隔时间切换
        autoPlay:function () {
            var _this_=this,
                tabItems=this.tabItems,//临时保存tab列表
                /**
                 * 注意：此处原来为
                 * tabLength=tabItems.size（）
                 * 图片不会轮播
                 * 若改成tabLength=tabItems.size
                 * 图片轮播出现问题，不会重复
                 * 对于高版本的jQuery size()
                 * 用length属性来代替
                 * **/
                tabLength=tabItems.length,//tab的个数
                config=this.config;

            this.timer=window.setInterval(function () {
              _this_.loop++;
              if(_this_.loop>=tabLength){
                  _this_.loop=0;
              };
              tabItems.eq(_this_.loop).trigger(config.triggerType);

            },config.auto);
        },

        //事件驱动函数
        invoke:function (currentTab) {
            var _this_=this;
            /**
             * 要执行Tab的选中状态，当前选中的加上类actived
             * 切换对应的选项卡内容，要根据配置参数的effect来修改
             * **/
            //记录选项卡索引
            var index=currentTab.index();
            //tab选中状态
            currentTab.addClass("actived").siblings().removeClass("actived");
            //切换对应的内容区域
            var effect=this.config.effect;
            var contentItems=this.contentItems;
            if(effect==="default" ||effect!="fade"){
                contentItems.eq(index).addClass("current").siblings().removeClass("current");
            }else if(effect==="fade"){
                contentItems.eq(index).fadeIn().siblings().fadeOut();
            };
//如果配置了自动切换，记得把当前的loop值设置成当前tab的index值
            if(this.config.auto){
                this.loop=index;
            };

        },

        //获取配置参数
        getConfig:function (){
            //获取到tab元素节点上面的data-config
            var config=this.tab.attr("data-config");
            if(config&&config!=""){
                //转译成对象并且返回出去
                return $.parseJSON(config);
            }else{
                return null;
            };
        }

    };

    window.Tab=Tab;

})(jQuery);