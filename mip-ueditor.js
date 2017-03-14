/**
 * ueditor产出页面mip化支持
 * @file 项目主入口
 * @version 1.0
 * @author mip-support@baidu.com, fengchuantao@baidu.com
 */

(function (UE) {

    /**
    * MipUeditor类
    *
    * @class
    */
    function MipUeditor() {
        this.htmlStr = ''; // 原始html字符串
        this.htmlElement; // element对象
        this.computeStyle = ''; // 保存计算属性
        this.computeStyleArray = []; // 提取classname集合
        this.mipPage = ''; // 完整的mippage页面
    }

    MipUeditor.prototype = {
        constructor: MipUeditor,

        /**
         * 初始化htmlStr
         *
         * @param {string} htmlStr 原始字符串
         */
        setInternalHtml: function (htmlStr) {
            // 每次初始化之前应该先重置对象属性
            this.destructObj();
            this.htmlStr = htmlStr;
        },

        /**
        * 将获取的字符串转为dom element
        *
        */
        createXml: function () {
            var domWrap = document.createElement('div');
            domWrap.innerHTML = this.htmlStr;
            this.htmlElement = domWrap;
        },

        /**
        * 遍历整个dom element
        *
        */
        traversalDom: function () {
            var rootNode = document.createNodeIterator(this.htmlElement, NodeFilter.SHOW_ELEMENT, null, false);
            var nodeList = rootNode.nextNode();
            while (nodeList !== null) {
                this.correctClass(nodeList);
                nodeList = rootNode.nextNode();
            }
        },

        /**
         * mip标签融合处理
         *
         * @param { Object } nodeDom dom对象
         */
        fuseMipHtml: function (nodeDom) {
            if (!nodeDom) {
                return;
            }

            MipUeditor.MipHtmlTool.filterHtml(nodeDom);
        },

        /**
        * 修正dom节点中style自定义样式
        *
        * @param { Object } nodeDom dom对象
        */
        correctClass: function (nodeDom) {
            if (!nodeDom) {
                return;
            }

            var styleText = nodeDom.getAttribute('style');
            if (styleText) { // 该标签上之定义了style
                var className = nodeDom.className;
                var domClassName = this.createClassName(styleText);
                if (className) { // 如果该标签已经存在classname
                    domClassName = className + ' ' + domClassName;
                }

                nodeDom.className = domClassName;
                this.addPageComputeStyle(styleText);
                this.removeDomStyle(nodeDom);
            }

            this.fuseMipHtml(nodeDom);
        },

        /**
        * 移除整个dom上的style标签
        *
        * @param { Object } nodeDom dom对象
        */
        removeDomStyle: function (nodeDom) {
            if (!nodeDom) {
                return;
            }

            nodeDom.removeAttribute('style');
        },

        /**
        * 增加整个页面的计算样式
        *
        * @param { string } styleText 获取到Domstyle字符串
        */
        addPageComputeStyle: function (styleText) {
            if (!styleText) {
                return;
            }

            this.computeStyle += this.createStyleForOne(styleText);
        },

        /**
         * 创建一个demo的计算样式
         *
         * @param { string } styleText 获取到Domstyle字符串
         * @return { string } 提取到的style
         */
        createStyleForOne: function (styleText) {
            if (!styleText) {
                return;
            }

            var MipClassName = this.createClassName(styleText);

            // 如果改class名称在页面中存在则返回空样式
            if (this.computeStyleArray.indexOf(MipClassName) >= 0) {
                return '';
            }

            this.computeStyleArray.push(MipClassName);
            var classNameOne = '.' + MipClassName;
            return classNameOne + '{' + styleText + '}';
        },

        /**
        * 创建一个唯一识别的classname
        *
        * @param { string } styleStr 样式字符串
        * @return { string }
        */
        createClassName: function (styleStr) {
            if (!styleStr) {
                return;
            }

            return 'mip-ueditor-ext-' + this.createHashName(styleStr);
        },

        /**
         * 把header内部style与内嵌样式合并
         *
         * @param { string } headerStyle header头部的样式
         */
        mergeStyle: function (headerStyle) {
            this.computeStyle += headerStyle;
        },

        /**
        * 析构函数 重置对象属性
        *
        */
        destructObj: function () {
            this.htmlStr = '';
            this.htmlElement;
            this.computeStyle = '';
            this.computeStyleArray = [];
            this.mipPage
        },

        /**
         *  hash算法实现classname唯一后缀标识
         *
         * @param {string } str 样式字符串
         * @return { string } hash字符串
         */
        createHashName: function (str) {
            str += '';
            var arr = [];
            var len = str.length;
            var arg = Math.SQRT2.toFixed(9) - 0;

            forEach(function (x) {
                arr[x] = 0;
            });

            for (var i = 0; i < str.length; i++) {
                calc(str.charCodeAt(i));
            }

            forEach(function (x) {
                arr[x] = arr[x].toString(16);
                if (arr[x].length < 2) {
                    arr[x] = '0' + arr[x];
                }

            });

            arr.reverse();
            return arr.join('');

            function calc(nmb) {
                var c = nmb & 255;
                var next = nmb >> 8;
                forEach(function (x) {
                    var h = (x ? arr[x - 1] : 0) + arr[x] + x + len + c;
                    h += (h / arg).toFixed(9).slice(-3) - 0;
                    arr[x] = h & 255;
                });
                if (next > 0) {
                    calc(next);
                }
            }

            function forEach(func) {
                for (var i = 0; i < 16; i++) {
                    func(i);
                }
            }
        },

        /**
         * 设定全局mip页面html
         *
         */
        setAllMip: function () {
            var mipPageHtml = [
                '<!DOCTYPE html>',
                '   <html mip>',
                '       <head>',
                '           <meta charset="UTF-8">',
                '               <meta name="viewport" content = "width=device-width,minimum-scale=1,initial-scale=1">',
                '               <title>MIP DEMO</title>',
                '               <link rel="stylesheet" type="text/css" href="https://mipcache.bdstatic.com/static/v1/mip.css">',
                '               <link rel="canonical" href="https://www.baidu.com">',
                '               <style mip-custom>' + this.computeStyle + '</style>',
                '       </head>',
                '     <body>' + this.htmlElement.innerHTML + '',
                '       <script src="https://mipcache.bdstatic.com/static/v1/mip.js"></script>',
                '     </body>',
                '   </html>'
            ].join('');
            this.mipPage = mipPageHtml;
        }
    };

    MipUeditor.MipHtmlTool = {

        /**
         * 转换为mipimg标签
         *
         */
        transformMipimg: function () {
            var ele = this; // 当前this为node节点
            var thisTool = MipUeditor.MipHtmlTool;
            var src = ele.getAttribute('src');
            var wid = ele.getAttribute('width') || '';
            var hei = ele.getAttribute('height') || '';
            if (!src) {
                return;
            }

            var mipImgconfig = {
                'src': src,
                'responsive': 'container'
            };

            if (wid !=='' && hei !== '') {
                mipImgconfig['width'] = wid;
                mipImgconfig['height'] = hei;
            }

            var mipimg = document.createElement('mip-img');
            thisTool.setAttribute.call(mipimg, mipImgconfig);
            thisTool.replaceDom.call(this, mipimg);
        },

        /**
         * 转换为转为为mip-link标签
         *
         */
        transformMipa: function () {
            var ele = this; // 当前this为node节点
            var thisTool = MipUeditor.MipHtmlTool;
            var href = ele.getAttribute('href');
            var title = ele.getAttribute('title') || '';
            var text = ele.innerHTML;
            if (!href) {
                return;
            }

            var miplink = document.createElement('mip-link');
            thisTool.setAttribute.call(miplink, {
                'href': href,
                'title': title
            });
            miplink.innerHTML = text;
            thisTool.replaceDom.call(this, miplink);
        },

        /**
        * 过滤mip标签
        *
        * @param {Object} nodeDom dom对象
        */
        filterHtml: function (nodeDom) {
            var MipList = [
                'img',
                'a'
            ];
            var tagName = nodeDom.tagName.toLowerCase();
            if (MipList.indexOf(tagName) >= 0) {
                var prototypeName = 'transformMip' + tagName;
                this[prototypeName].call(nodeDom);
            }
        },

        /**
         * 将miphtml替换dom
         *
         * @param {Object} miphtml 创建mip对象
         */
        replaceDom: function (miphtml) {
            this.parentNode.replaceChild(miphtml, this);
        },

        /**
         * 封装setAttribute
         *
         * @param {Object} objAttr 传入需要设置数据的键值对
         */
        setAttribute: function (objAttr) {
            // 当前this为mipHtml节点
            for (var i in objAttr) {
                this.setAttribute(i, objAttr[i]);
            }
        }
    };

    var mipditor = new MipUeditor();

    /**
     * 需要重写getAllHtml方法，防止覆盖原型链重新取名为mipGetAllHtml的单独方法。
     *
     * @return    {string}                获取因为特殊样式生成的内联样式
     */
    function mipGetAllHtml() {
        var me = this;
        var headHtml = [];
        var styleStr = '';
        me.fireEvent('getAllHtml', headHtml);
        // 重新拼接css去掉页面自带属性
        var headerDom = me.document.getElementsByTagName('head')[0];
        var headerStyleList = headerDom.getElementsByTagName('style');
        for (var i = 0; i < headerStyleList.length; i++) {
            var oneStyle = headerStyleList[i];
            styleStr += oneStyle.innerHTML;
        }
        return styleStr;
    }

    /**
     * MipUeditor对外入口
     *
     * @return { Object }
     */
    UE.Editor.prototype.getMipContent = function () {
        var allHtml = this.getContent();
        mipditor.setInternalHtml(allHtml);
        mipditor.createXml();
        mipditor.traversalDom();
        var headerStyle = mipGetAllHtml.call(this);
        mipditor.mergeStyle(headerStyle);
        mipditor.setAllMip();
        return {
            mipHtml: mipditor.htmlElement.innerHTML,
            mipStyle: mipditor.computeStyle,
            mipPage: mipditor.mipPage
        };
    };
})(UE);
