###  mip-ueditor

#### 简介

 mip-ueditor用于将ueditor富文本产出的页面，直接转换为符合mip标准的mip页面,方便站长使用在ueditor的时候能够与mip无缝链接。
 

#### 安装

> 将安装包中的mip-ueditor.min.js引入项目即可, mip-ueditor只包含插件部分,ueditor相关配置请自行下载。



#### 快速开始

ueditor页面: 

```
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <script type="text/javascript" charset="utf-8" src="ueditor.config.js"></script>
    <script type="text/javascript" charset="utf-8" src="ueditor.all.min.js"> </script>
    <script src='./mip-ueditor.min.js' charset="utf-8"></script>
    <link rel="stylesheet" type="text/css" href="https://mipcache.bdstatic.com/static/v1/mip.css">
 </head>
<body>
</body>
<script>
	var mipObj = UE.getEditor('editor').getMipContent();
</script>

```

mip页面: 

```
<mip-ueditor>
 // 产出的mip html
</mip-ueditor>
```




#### 详细说明

getMipContent函数来至于ueditor扩展，直接使用即可。插件将会返回一个对象
。对象属性详见**API参考**.



#### API参考

**mipHtml属性**

mipHtml为ueditor产出页面转换后的mip html字符串

**mipStyle属性**

mipStyle为ueditor产出页面转换后的mip css字符串,是mipHtml字符串抽离后的样式。


**mipPage属性**

mipPage为mipHtml+mipStyle后的产出模型为一个完整的miphtml页面




#### 使用中可能遇到的问题

1. 编辑样式与产出样式不符合。请检查在ueditor编辑页面是否引用了mip.css。mip.css的有部分样式重置，在编辑时请务必引入

2. 我有样式主题怎么办？因为外部引入的css样式，暂时无法覆盖。我们为主题提供了mip标签，在使用时需手动在mip页中加入主题css.看起来就像这样

```
<style>

mip-ueditor p {
	color: #333;
}
 
</style>

<mip-ueditor>
	<p>我就单纯测试一下</p>
</mip-ueditor>

```



#### 浏览器支持

ie9+



#### 技术支持

邮箱：mip-support@baidu.com

#### 当前版本

tag v1.0.0

#### 版本更新

tag v1.0.0 2017年3月14日 


#### License

Copyright (c) 2016, Baidu Inc. All rights reserved.

