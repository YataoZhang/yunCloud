/**
 * Created by zhangyatao on 15/9/23.
 */
!function (base) {
    "use strict";
    var global = global, self = self;
    if ("object" === typeof exports && "undefined" !== typeof module) {
        module.exports = base();
    } else if ("function" === typeof define && define.amd) {
        define([], base());
    } else {
        var platform;
        if ("undefined" !== typeof window) {
            platform = window;
        } else {
            "undefined" !== typeof global ? platform = global : "undefined" !== typeof self && (platform = self);
        }
        platform.yunCloud = base();
    }
}(function () {
    "use strict";
    var manger = (function () {
        var decodeCharacterEntities = {
            "&lt;": "<",
            "&gt;": ">",
            "&nbsp;": " ",
            "&quot;": "\"",
            "&amp;": "&"
        };
        var encodeCharacterEntities = {
            "&": "&amp;",
            "<": "&lt",
            ">": "&gt;",
            " ": "&nbsp;",
            "\"": "&quot;"
        };
        var transfer = function (type, str) {
            var transferCallback = function (key, value) {
                str = str.replace(new RegExp(key, 'g'), value);
            };
            if (type === 'encode') {
                util.forIn(encodeCharacterEntities, transferCallback);
            } else {
                util.forIn(decodeCharacterEntities, transferCallback);
            }
            return str;
        };
        var util = {
            noop: function (x) {
                return x || '';
            },
            forIn: function (obj, callback) {
                for (var n in obj) {
                    if (obj.hasOwnProperty(n)) {
                        callback.call(null, n, obj[n]);
                    }
                }
            },
            matchReg: /^([\S\s]+?)(|\|([\S\s]+))$/,
            convert: /<%-([\S\s]+?)%>/g,
            val: /<%&([\S\s]+?)%>/g,
            origin: /<%=([\S\s]+?)%>/g,
            expression: /<%([\s\S]+?)%>/g,
            render: function (str, variable) {
                var parasitic = '';
                if (variable) {
                    parasitic = 'data.';
                }
                var tpl = str.replace(/\n/g, '\\n').replace(/\'/g, '\\\'');
                if (util.convert.test(str)) {
                    tpl = tpl.replace(util.convert, function (match, code) {
                        return '\' + transfer("encode",' + parasitic + code + ') + \'';
                    });
                }
                if (util.val.test(str)) {
                    tpl = tpl.replace(util.val, function (match, code) {
                        return '\'+ ' + code + '+\'';
                    });
                }
                if (util.origin.test(str)) {
                    tpl = tpl.replace(util.origin, function (match, code) {
                        code = parasitic + code;
                        if (/\|/.test(code = code.trim())) {
                            var funcName = code.match(util.matchReg);
                            return '\'+ (' + (event[funcName[3]] || util.noop).toString() + ')(' + funcName[1] + ') +\''
                        } else {
                            return '\'+' + code + '+\'';
                        }
                    });
                }
                if (util.expression.test(str)) {
                    tpl = tpl.replace(util.expression, function (match, code) {
                        return '\');\n' + code + '\ntpl.push(\'';
                    });
                }
                tpl = tpl.replace(/\'\n/g, '\'').replace(/\n\'/gm, '\'');
                tpl = 'tpl.push(\'' + tpl + '\');';
                tpl = tpl.replace(/tpl.push\((''|'[\\n\s]+)'\);/g, '');
                if (variable) {
                    tpl = 'var tpl=[];' + tpl + '\nreturn tpl.join(\'\');';
                } else {
                    tpl = 'var tpl=[];\nwith(obj||{}){\n' + tpl + '\n}\nreturn tpl.join(\'\');';
                }
                var argu = variable ? 'data' : 'obj';
                return new Function(argu, 'transfer', tpl);
            }
        };
        var LimitableMap = function () {
            this.map = {};
        };
        LimitableMap.prototype.set = function (len, text, value) {
            (this.map[len] || ( this.map[len] = {}))[text] = value;
        };
        LimitableMap.prototype.get = function (len) {
            return this.map[len] || {};
        };
        var pool = new LimitableMap();
        return {
            isCache: true,
            template: function (temp, variable) {
                var tpl = null;
                if (this.isCache) {
                    tpl = pool.get(temp.length)[temp];
                    if (!tpl) {
                        tpl = util.render(temp, variable);
                        pool.set(temp.length, temp, tpl);
                    }
                } else {
                    tpl = util.render(temp, variable);
                }
                return function (obj) {
                    return tpl(obj, transfer);
                };
            }
        };
    })();
    var event = {};
    /**
     * 编译模版
     * @param {string} str 模版字符串
     * @param {Object} data 模版数据
     * @param {boolean} variable 是否启用变量编译
     * @returns {*}
     */
    var yunCloud = function (str, data, variable) {
        if (arguments.length === 1) {
            return manger.template(str);
        }
        return manger.template(str, variable)(data);
    };
    /**
     * 注册过滤器
     * @param {string} funcName 过滤器名称
     * @param {Function} callback 回调函数
     */
    yunCloud.register = function (funcName, callback) {
        event[funcName] = callback;
    };
    /**
     * 解除过滤器
     * @param {string} funcName 过滤器名称
     */
    yunCloud.unRegister = function (funcName) {
        delete event[funcName];
    };
    /**
     * 设置缓存状态
     * @param {boolean} isCache 是否缓存生成的模版
     */
    yunCloud.setCache = function (isCache) {
        manger.isCache = !!isCache;
    };
    return yunCloud;
});