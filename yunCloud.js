/**
 * Created by zhangyatao on 15/9/23.
 */
 !function (base) {
            if ("object" == typeof exports && "undefined" != typeof module) {
                module.exports = base();
            } else if ("function" == typeof define && define.amd) {
                define([], base());
            } else {
                var platform;
                if ("undefined" != typeof window) {
                    platform = window
                } else {
                    "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self)
                }
                platform.yunCloud = base()
            }
        }(function () {
            var manger = (function () {
                var decodeCharacterEntities = {
                    "&lt;": "<",
                    "&gt;": ">",
                    "&amp;": "&",
                    "&nbsp;": " ",
                    "&quot;": "\""
                };

                var encodeCharacterEntities = {
                    "<": "&lt",
                    ">": "&gt;",
                    "&": "&amp;",
                    " ": "&nbsp;",
                    "\"": "&quot;"
                };


                var transfer = function (type, str) {
                    var transferCallback = function (key, value) {
                        str = str.replace(new RegExp(key, 'g'), value)
                    };
                    if (type == 'encode')
                        return util.forIn(encodeCharacterEntities, transferCallback);
                    return util.forIn(decodeCharacterEntities, transferCallback);
                };
                var util = {
                    noop: function (x) {
                        return x || '';
                    },
                    forIn: function (obj, callback) {
                        for (var n in obj) {
                            if (!obj.hasOwnProperty(n)) continue;
                            callback.call(null, n, obj[n]);
                        }
                    },
                    matchReg: /^([\S\s]+?)(|\|([\S\s]+))$/,
                    render: function (str) {
                        var tpl = str.replace(/\n/g, '\\n')
                                .replace(/<%-([\S\s]+?)%>/g, function (match, code) {
                                    return '+ transfer("encode","' + code + '")+';
                                }).replace(/<%&([\S\s]+?)%>/g, function (match, code) {
                                    return '\'+ ' + code + '+\'';
                                }).replace(/<%=([\S\s]+?)%>/g, function (match, code) {
                                    if (/\|/.test(code = code.trim())) {
                                        var funcName = code.match(util.matchReg);
                                        return '\'+ (' + (event[funcName[3]] || util.noop).toString() + ')(' + funcName[1] + ') +\''
                                    } else {
                                        return '\'+' + code + '+\'';
                                    }
                                }).replace(/<%([\s\S]+?)%>/g, function (match, code) {
                                    return '\';\n' + code + '\ntpl+=\'';
                                }).replace(/\'\n/g, '\'')
                                .replace(/\n\'/gm, '\'');
                        tpl = 'tpl=\'' + tpl + '\';';
                        tpl = tpl.replace(/''/g, '\'\\n\'');
                        tpl = 'var tpl=\'\';\nwith(obj||{}){\n' + tpl + '\n}\nreturn tpl;';
                        return new Function('obj', 'transfer', tpl);
                    }
                };

                return {
                    template: function (temp) {
                        var tpl = util.render(temp);
                        console.log(tpl);
                        return function (obj) {
                            return tpl(obj, transfer);
                        }
                    }
                }
            })();

            var event = {};

            var yunCloud = function (str, data) {
                if (arguments.length == 1) {
                    return manger.template(str);
                }
                return manger.template(str)(data);
            };
            yunCloud.register = function (funcName, callback) {
                event[funcName] = callback;
            };
            yunCloud.unRegister = function (funcName) {
                delete event[funcName];
            };
            return yunCloud;
        });