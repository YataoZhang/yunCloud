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
  
 /*
 *编译出来的的函数为
 *  var tpl=[];
 *  with(obj||{}){
 *  tpl.push(''+ name +'');
 *  }
 *  return tpl.join('');
 */
```
##### | 启用变量编译方式,这种方法更加提高性能
*因为js引擎对with关键字无法做出执行层面的优化.所以这种方式可以避免使用with关键字以提升执行效率.但是要注意使用场景,这种方法不是所有场景都可以使用的.*
```js
 var tpl = yunCloud(tpl, data, true);
 
 /*
 *编译出来的的函数为
 *  var tpl=[];tpl.push(''+data.name+'');
 *  return tpl.join('');
 */
```
##### | 仅编译模版暂不渲染，它会返回一个可重用的编译后的函数.
```js
 var template_String = yunCloud(tpl);
 // 根据data渲染得到html
 var tpl = template_String(data);
 // 放到指定元素中
 $('#ele').html(tpl);
```
##### | 注册/注销自定义函数，实现angularJS中的过滤器。在下边 &lt;%= 变量 %> 中会有实例。
```js
yunCloud.register('filterName', function);
yunCloud.unregister('filterName');
```
##### | 设置缓存状态。(默认为缓存)
*默认为缓存,用以提示在浏览器中的执行效率;但是在nodejs等后端环境中内存的合理使用十分重要,稍不留意就可能造成内存泄漏,所以,在nodejs等后端环境中使用模版时推荐关闭缓存.*
```js
yunCloud.setCache(false); // 设置为不缓存生成的模版函数

yunCloud.setCache(true);  // 设置为缓存生成的模版函数
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
var Str = yunCloud(str, {name: 'world'}, true);
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

yunCloud(tpl)(); // => <div>hello</div>
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

// 

```
上面的方法会生成如下的`html`。接下来就可以按照开发者的应用场景进行更灵活的开发。
```html
<ul>
  <li>
    <a href="http://www.baidu.com" alt="百度一下" />
  </li>
  <li>
    <a href="http://pan.baidu.com" alt="百度网盘" />
  </li>
  <li>
    <a href="http://yun.baidu.com" alt="百度云" />
  </li>
</ul>
```
