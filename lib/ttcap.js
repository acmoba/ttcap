/********************************************************************
 * @author tonyleen
 ********************************************************************
 */
var canvas = require("canvas");
var words = require('./word.js');
var os = require('os');
var fs = require('fs');
var iswindows = (os.type() != 'Windows_NT' ? false : true);

var path = require('path');
var fonts = ['LiSu', 'YouYuan'];
var cus_fonts = [];
if (!iswindows) {
    var Font = canvas.Font;
    var SIMLI = new Font('SIMLI', fontFile('SIMLI.TTF'));//隶书
    var SIMYOU = new Font('SIMYOU', fontFile('SIMYOU.TTF'));//幼圆

    cus_fonts = [SIMLI, SIMYOU];
    fonts = ['LiSu', 'YouYuan'];
}

function fontFile(name) {
    return path.join(__dirname, '/fonts/', name);
}

//随机 >=0 && <len 的数
function randNum(len) {
    return parseInt(len * Math.random());
}
function randArray(arr) {
    return arr[randNum(arr.length)];
}
//打乱arr
function shuffle(arr) {
    arr.sort(function () {
        return 0.5 - Math.random()
    })
}

function createCaptcha(num) {
    var listCount = 9;
    var groupCount = listCount;
    if (groupCount > words.length) groupCount = words.length;
    var codeIndex = [];
    while (codeIndex.length < groupCount) {
        var _idx = randNum(words.length);
        if (codeIndex.indexOf(_idx) == -1) codeIndex.push(_idx);
    }
    //console.log(codeIndex.join(""));

    var question = [];
    var list = [];

    for (var i = 0; i < codeIndex.length; i++) {
        var _arr = words[codeIndex[i]];
        var _cnt = (listCount / 2) > _arr.length ? _arr.length : (listCount / 2);
        var _rd = randNum(_cnt) + 1; //从group中随机取出的个数
        var _o = [];
        while (_o.length < _rd) {
            var _idx = randNum(_arr.length);
            if (_o.indexOf(_arr[_idx]) == -1) _o.push(_arr[_idx]);
        }
        list = list.concat(_o);
    }
    list = list.slice(0, 9);
    shuffle(list);

    //从list选出question
    while (question.length < num) {
        var _idx = randNum(list.length);
        if (question.indexOf(list[_idx]) == -1) question.push(list[_idx]);
    }

    var answer = [];
    for (var i = 0; i < question.length; i++) {
        answer.push(list.indexOf(question[i]));
    }
    return {"list": list, "question": question, "answer": answer};
}

function drawCaptcha(captchaObj) {

    var word_question = captchaObj.question;//["倪","的","好","吗"];
    var word_list = captchaObj.list; //["倪","帝","好","豪","嘿","的","吗","我","霉"];
    var word_answer = captchaObj.answer;

    var offset = 50;
    var colors = ["rgb(0,0,0)"]; // ,"rgb(255,165,0)","rgb(16,78,139)","rgb(0,139,0)","rgb(255,0,0)"],
    //fonts = ["SimHei", "SimSun", "NSimSun", "FangSong", "Microsoft YaHei", "Microsoft JhengHei", "KaiTi", "PMingLiU", "MingLiU"],
    fontsizes = [30, 35, 25, 28, 22],//40,38,32,
        scales = [0.7, 0.8, 0.9, 1, 1.1, 1.2], //,1.3,1.4
        rotates = [-25, -20, -18, -15, -14, -12, -10, -8, -6, -5, 0, 0, 5, 7, 10, 13, 15, 16, 17, 20, 25], //,-180,-175,-170,-165,-160,-180
        translates = [0]; //,0,0,0,0,0,0,0,2,3,10,15

    var Image = canvas.Image
        , canv = new canvas((word_list.length * offset) * 2, offset * 2)
        , ctx = canv.getContext('2d');
    //ctx.font = '30px SimHei';
    //var te = ctx.measureText(word_question.join(""));
    ctx.textBaseline = "top";
    ctx.textAlign = "start";
    //ctx.fillText(word_question.join(""),0,0);

    for (var i = 0; i < word_question.length; i++) {
        var _offset = 35;
        var _canv = new canvas(_offset, _offset);
        var _ctx = _canv.getContext("2d");
        var _rotate = randArray([-12, -10, -8, -6, -5, 0, 0, 5, 7]);
        _ctx.textBaseline = "top";
        _ctx.textAlign = "start";
        _ctx.fillStyle = randArray(colors);
        if (iswindows) _ctx.font = randArray([25, 26, 27, 28]).toString() + "px " + randArray(fonts);
        else {
            var _tt_rdm = randNum(fonts.length);
            _ctx.addFont(cus_fonts[_tt_rdm]);
            _ctx.font = randArray([25, 26, 27, 28]).toString() + "px " + fonts[_tt_rdm];
        }
        _ctx.scale(randArray(scales), randArray(scales));
        _ctx.rotate(_rotate * Math.PI / 180);
        var _te = _ctx.measureText(word_question[i]);
        var _fillWidth = (_offset - _te["width"]) / 2;
        var _fillHeight = _te["emHeightAscent"] + (_offset - (_te["emHeightAscent"] + _te["emHeightDescent"])) / 2;
        _ctx.fillText(word_question[i], _fillWidth, _fillHeight);
        _ctx.translate(randArray(translates), randArray(translates));
        _ctx.fillText(word_question[i], _fillWidth, _fillHeight);

        var _imgData = _ctx.getImageData(0, 0, _offset, _offset);
        ctx.putImageData(_imgData, _offset * i, 0);
    }


    for (var i = 0; i < word_list.length; i++) {
        var _canv = new canvas(offset, offset);
        var _ctx = _canv.getContext("2d");
        var _rotate = randArray(rotates);
        var _reversal = _rotate > -120 ? false : true; //是否反转
        _ctx.textBaseline = "top";
        _ctx.textAlign = "start";
        if (_reversal) {
            _ctx.textBaseline = "bottom";
            _ctx.textAlign = "end";
        }
        _ctx.fillStyle = randArray(colors);
        /*
         //线
         _ctx.beginPath();
         _ctx.lineTo(randNum(offset), randNum(offset));
         _ctx.lineTo(randNum(offset),randNum(offset));
         _ctx.stroke();
         */
        if (iswindows) _ctx.font = randArray(fontsizes).toString() + "px " + randArray(fonts);
        else {
            var _tt_rdm = randNum(fonts.length);
            _ctx.addFont(cus_fonts[_tt_rdm]);
            _ctx.font = randArray(fontsizes).toString() + "px " + fonts[_tt_rdm];
        }
        _ctx.scale(randArray(scales), randArray(scales));

        _ctx.rotate(_rotate * Math.PI / 180);

        var _te = _ctx.measureText(word_list[i]);
        var _fillWidth = (offset - _te["width"]) / 2;
        var _fillHeight = _te["emHeightAscent"] + (offset - (_te["emHeightAscent"] + _te["emHeightDescent"])) / 2;
        if (_reversal) {
            _fillWidth *= -1;
            _fillHeight = 0;
        }
        _ctx.fillText(word_list[i], _fillWidth, _fillHeight);
        _ctx.translate(randArray(translates), randArray(translates));
        _ctx.fillText(word_list[i], _fillWidth, _fillHeight);

        var _imgData = _ctx.getImageData(0, 0, offset, offset);
        ctx.putImageData(_imgData, offset * i, offset);
    }

    //钝角
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    var line1_start = {
        x: randNum(offset) - offset / 2,
        y: randNum(offset)
    };
    var line1_mid = {
        x: randNum(word_question.length / 2 * offset) + offset,
        y: randNum(offset)
    };
    var line1_end = {
        x: randNum(offset) + (word_question.length - 1) * offset,
        y: randNum(offset)
    };
    ctx.moveTo(line1_start.x, line1_start.y);
    ctx.lineTo(line1_mid.x, line1_mid.y);
    ctx.lineTo(line1_end.x, line1_end.y);
    ctx.stroke();
    //锐角
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    var line2_start = {
        x: randNum(offset) - offset / 2,
        y: randNum(offset)
    };
    var line2_mid = {
        x: randNum(offset) + (word_question.length - 1) * offset,
        y: randNum(offset)
    };
    var line2_end = {
        x: randNum(word_question.length / 2 * offset),
        y: randNum(offset)
    };
    ctx.moveTo(line2_start.x, line2_start.y);
    ctx.lineTo(line2_mid.x, line2_mid.y);
    ctx.lineTo(line2_end.x, line2_end.y);
    ctx.stroke();
    //直线
    ctx.beginPath();
    var line3_start = {
        x: randNum(offset) - offset / 2,
        y: randNum(offset)
    };
    var line3_end = {
        x: randNum(offset) + (word_question.length - 1) * offset,
        y: randNum(offset)
    };
    ctx.moveTo(line3_start.x, line3_start.y);
    ctx.lineTo(line3_end.x, line3_end.y);
    ctx.stroke();
    return canv;
}

exports.getCap = function (number) {
    var _obj = {};
    _obj._oa = createCaptcha(number);
    _obj.answer = _obj._oa.answer || '';
    _obj.cap = drawCaptcha(_obj._oa);
    return _obj;
};


