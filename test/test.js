QUnit.test('slash and quote should be escaped', function (assert) {
    var result = yunCloud('<%= hi %>\\"', {hi: 'world'});
    assert.ok(result === 'world\\"', 'Passed!');
});
QUnit.test('should ignore undefined variable', function (assert) {
    var result = yunCloud('<%= hi%>', {}, true);
    assert.ok(result === '', 'Passed!');
});
QUnit.test('enable cache', function (assert) {
    yunCloud.set({
        cache: true
    });
    var result = yunCloud('<%= isCache %>');
    assert.ok(result === yunCloud('<%= isCache %>'), 'Passed!');
});
QUnit.test('disable cache', function (assert) {
    yunCloud.set({
        cache: false
    });
    var result = yunCloud('<%= isDisableCache %>');
    assert.ok(result !== yunCloud('<%= isDisableCache %>'), 'Passed!');
});
QUnit.test('variable escape', function (assert) {
    var result = yunCloud('<%- isEscape %>', {isEscape: '<div></div>'});
    assert.ok(result === '&lt;div&gt;&lt;/div&gt;', 'Passed!')
});
QUnit.test('variable not escape', function (assert) {
    var result = yunCloud('<%= isNoEscape %>', {isNoEscape: '<div></div>'});
    assert.ok(result === '<div></div>', 'Passed!')
});
QUnit.test('strip', function (assert) {
    yunCloud.set({
        strip: true
    });
    var result = yunCloud('<%= isStrip %>\r\n', {isStrip: 'hello world'});
    assert.ok(result === 'hello world  ', 'Passed!');
});
QUnit.test('not strip', function (assert) {
    yunCloud.set({
        strip: false
    });
    var result = yunCloud('<%= isNotStrip %>\r\n', {isNotStrip: 'hello world'});
    assert.ok(result === 'hello world\r\n', 'Passed!');
});
QUnit.test('for statement [Array]', function (assert) {
    var list = '<% var list=[10,20,30,40,50]; %>';
    var forStatement = '<% for(var i=0,l=list.length;i<l;i++) {%>index:<%&i%>value:<%&list[i]%>; <% } %>';
    var result = yunCloud(list + forStatement)();
    assert.ok(result === 'index:0value:10; index:1value:20; index:2value:30; index:3value:40; index:4value:50; ', 'Passed!')
});
QUnit.test('for statement [Object]', function (assert) {
    var list = '<% var list={k1:"v1",k2:"v2",k3:"v3"} %>';
    var forStatement = '<% for(var n in list) { %>key:<%&n%> value:<%&list[n]%>; <% } %>';
    var result = yunCloud(list + forStatement)();
    assert.ok(result === 'key:k1 value:v1; key:k2 value:v2; key:k3 value:v3; ', 'Passed!')
});
if ([].forEach) {
    QUnit.test('for statement [Object], that variables outer the for environment', function (assert) {
        var list = '<% var list=[10,20,30,40,50]; var item="outer item"; %>';
        var forStatement = '<% list.forEach(function(item,index){ %> <%&item%> <% }); %><%& item %>';
        var result = yunCloud(list + forStatement)();
        assert.ok(result === ' 10  20  30  40  50 outer item', 'Passed!')
    });
}
QUnit.test('custom functions with register and unregister', function (assert) {
    var fn = function (s) {
        return s + '.';
    };
    yunCloud.register('fn', fn);
    var tpl = yunCloud('<%= hello | fn%>');
    var result = tpl({hello: 'world'});
    assert.ok(result === 'world.', 'Passed!')
});