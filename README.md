yunCloud
============

## yunCloud中文文档 
*一个轻量级的js前端模版库*

`yunCloud` 是一个高效、轻量`[压缩完只有2k]`、兼容`javascript`逻辑语法的前端 (Javascript) 模板引擎，使用 `yunCloud` 可以是你的代码实现数据和视图模型的分离(MVC)。 除此之外，它还可以在 `Node.js` 环境中运行（正在测试中）。

你可以在遵守 MIT Licence 的前提下随意使用并分发它。yunCloud 代码完全开源并托管在 Github 上。

### yunCloud的引入
``` html
  <script type="text/javascript" src="yunCloud.js"></script>
```
### * 使用方法
##### | 编译模板并根据所给的数据立即渲染出结果.
```js
 var tpl = yunCloud(tpl, data);
```
##### | 仅编译模版暂不渲染，它会返回一个可重用的编译后的函数.
```js
 var template_String = yunCloud(tpl);
 // 根据Data渲染得到html
 template_String(data);
```
##### | 注册/注销自定义函数，实现angularJS中的过滤器。在下边 <%= 变量 %> 中会有实例。
```js
yunCloud.register('filterName', function);
yunCloud.unregister('filterName');
```
### * 语法
##### | <%= 变量 %>
```
<%= content %>
<%= content|filter %>
```
```js
var str = 'hello <%= name|filter %>';
yunCloud.register('filter', function (data) {
    return data + '_Filter';
});
var Str = yunCloud(str, {name: 'world'});
console.log(Str); // => hello world_Filter
```
##### | <%- 变量 %>
> 这个是为了解决内容转义提供的功能。(此写法不支持Filter过滤器)

*例如：需要在页面中显示`<script>alert(1);</script>` 直接使用<%= 变量 %>会发现页面会执行此内容。如果使用<%- 变量 %>会对内容进行转义。在页面中是不会执行此内容，而是原原本本的在页面中输出。*
```js
var str = '<%- <script>alert(1);</script> %>'
str = yunCloud(str)();
document.getElementById('ele').innerHTML = str;
// 页面未弹出1
```
##### | <%& javascript变量 %>
此命令会原样输出javascript变量
```js
var tpl = '<% var name = "hello" %><div><%& name %></div>';

yunCloud(tpl)();
```
##### | <% javascript逻辑代码 %>
```js
var tpl = [
    '<% for(var i = 0;i<10;i++) {%>',
      '<div>这是第<%& i %>个div</div>',
    '<% } %>'
  ].join('');
  
yunCloud(tpl);

```
##### 让我们通过一个例子演示一下自定义函数的奇妙用法吧.
```js
var jsonData = {
    linkList: [
        {href: 'http://www.baidu.com', alt: '百度一下'},
        {href: 'http://pan.baidu.com', alt: '百度网盘'},
        {href: 'http://yun.baidu.com', alt: '百度云'}
    ]
};

var tpl = [
    '<ul>',
        '<% for(var i=0,len=linkList.length;i<len;i++){ %>',
            '<% var val = linkList[i]; %>',
            '<li><%= val|linkFilter %></li>',
        '<% } %>',
    '</ul>'
].join('');

var linkFilter = function (data) {
     return '<a href="' + data.href + '" alt="' + data.alt + '" />';
};

yunCloud.register('linkFilter', linkFilter);

yunCloud(tpl, jsonData);
```
