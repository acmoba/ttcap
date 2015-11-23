var canvas = require("canvas");
var words =
    ['伉', '伋', '伌', '伎', '伏', '伒', '伓', '伔', '伕', '伖', '伛', '伜', '伝', '伡', '伢', '伣', '伥', '伧', '伨', '伩', '伫', '伬', '伭', '伮', '伱', '伲', '伳', '伵', '伷', '伹', '伻', '伾', '伿', '佀', '佁', '佂', '佄', '佅', '佇', '佈', '佉', '佊', '佋', '佌', '佒', '佔', '佖', '佗', '佘', '佝', '佞', '佟', '佡', '佢', '佤', '佥', '佦', '佧', '佨', '佪', '佫', '佬', '佭', '佮', '佯', '佰', '佱', '佲', '佳', '佴', '併', '佶', '佷', '佸', '佹', '佺', '佻', '佼', '佽', '佾', '侀', '侁', '侂', '侃', '侄', '侅', '來', '侇', '侈', '侉', '侊', '侌', '侎', '侏', '侐', '侑', '侒', '侓', '侔', '侕', '侖', '侗', '侘', '侙', '侚', '侜', '侞', '侟', '侠', '価', '侢', '侤', '侥', '侨', '侩', '侪', '侫', '侬', '侭', '侮', '侰', '侱', '侲', '侳', '侴', '侶', '侷', '侸', '侹', '侺', '侻', '侼', '侽', '侾', '俀', '俁', '係', '们', '伟', '俅', '俆', '俇', '俈', '俉', '俋', '俌', '俍', '俎', '俏', '俒', '俓', '俔', '俕', '俖', '俙', '俛', '俜', '俟', '俠', '俣', '俤', '俥', '俦', '俧', '俨', '俪', '俫', '俬', '俰', '俲', '俳', '俴', '俵', '俶', '俷', '俸', '俹', '俺', '俻', '俼', '俽', '俾', '俿', '倀', '倁', '倂', '倃', '倄', '倅', '倆', '倇', '倈', '倉', '倊', '倌', '倍', '倎', '倏', '倐', '們', '倓', '倔', '倕', '倖', '倗', '倛', '倜', '倝', '倞', '倠', '倢', '倣', '倥', '倧', '倨', '倩', '倪', '倬', '倭', '倮', '倯', '倰', '倱', '倲', '倳', '吳', '吶', '吷', '吺', '吽', '呀', '呁', '呃', '呄', '呅', '呇', '呉', '呋', '呋', '呌', '呍', '呎', '呏', '呐', '呒', '呓', '呔', '呕', '呗', '呙', '呚', '呛', '呜', '呝', '呞', '呟', '呠', '呡', '呢', '呣', '呤', '呥', '呦', '呧', '周', '呩', '呪', '呫', '呬', '呭', '呮', '呯', '呰', '呱', '呲', '呴', '呶', '呵', '呷', '呸', '呹', '呺', '呻'];



//随机 >=0 && <len 的数
function randNum(len){
    return parseInt(len*Math.random());
}
function randArray(arr){
    return arr[randNum(arr.length)];
}
//打乱arr
function shuffle(arr){
    arr.sort(function(){ return 0.5 - Math.random() })
}

function createCaptcha(num){
    var listCount = 9;
    var groupCount  = listCount;
    if(groupCount>words.length) groupCount = words.length;
    var codeIndex = [];
    while(codeIndex.length<groupCount){
        var _idx = randNum(words.length);
        if(codeIndex.indexOf(_idx)==-1) codeIndex.push(_idx);
    }
    //console.log(codeIndex.join(""));

    var question = [];
    var list =  [];

    for(var i=0;i<codeIndex.length;i++){
        var _arr = words[codeIndex[i]];
        var _cnt = (listCount/2)>_arr.length?_arr.length:(listCount/2);
        var _rd = randNum(_cnt)+1; //从group中随机取出的个数
        var _o = [];
        while(_o.length<_rd){
            var _idx = randNum(_arr.length);
            if(_o.indexOf(_arr[_idx])==-1) _o.push(_arr[_idx]);
        }
        list = list.concat(_o);
    }
    list = list.slice(0,9);
    shuffle(list);

    //从list选出question
    while(question.length<num){
        var _idx = randNum(list.length);
        if(question.indexOf(list[_idx])==-1) question.push(list[_idx]);
    }

    var answer = [];
    for(var i=0;i<question.length;i++){
        answer.push(list.indexOf(question[i]));
    }
    return {"list":list,"question":question,"answer":answer};
}

function drawCaptcha(captchaObj){

    var word_question = captchaObj.question;//["倪","的","好","吗"];
    var word_list = captchaObj.list; //["倪","帝","好","豪","嘿","的","吗","我","霉"];
    var word_answer = captchaObj.answer;

    var offset=50;
    var colors=["rgb(0,0,0)"]; // ,"rgb(255,165,0)","rgb(16,78,139)","rgb(0,139,0)","rgb(255,0,0)"],
        fonts = ["SimHei","SimSun","NSimSun","FangSong","Microsoft YaHei","Microsoft JhengHei","KaiTi","PMingLiU","MingLiU"],
        fontsizes = [30,35,25,28,22],//40,38,32,
        scales = [0.7,0.8,0.9,1,1.1,1.2], //,1.3,1.4
        rotates = [-25,-20,-18,-15,-14,-12,-10,-8,-6,-5,0,0,5,7,10,13,15,16,17,20,25], //,-180,-175,-170,-165,-160,-180
        translates = [0]; //,0,0,0,0,0,0,0,2,3,10,15

    var Image = canvas.Image
        , canv = new canvas((word_list.length*offset)*2,offset*2)
        , ctx = canv.getContext('2d');
    //ctx.font = '30px SimHei';
   //var te = ctx.measureText(word_question.join(""));
    ctx.textBaseline="top";
    ctx.textAlign = "start";
    //ctx.fillText(word_question.join(""),0,0);

    for(var i=0;i<word_question.length;i++){
        var _offset = 35;
        var _canv = new canvas(_offset,_offset);
        var _ctx=_canv.getContext("2d");
        var _rotate = randArray([-12,-10,-8,-6,-5,0,0,5,7]);
        _ctx.textBaseline="top";
        _ctx.textAlign="start";
        _ctx.fillStyle = randArray(colors);
        _ctx.font = randArray([25,26,27,28]).toString()+"px "+randArray(fonts);
        _ctx.scale(randArray(scales),randArray(scales));
        _ctx.rotate(_rotate*Math.PI/180);
        var _te = _ctx.measureText(word_question[i]);
        var _fillWidth = (_offset-_te["width"])/2;
        var _fillHeight = _te["emHeightAscent"]+(_offset-(_te["emHeightAscent"]+_te["emHeightDescent"]))/2;
        _ctx.fillText(word_question[i],_fillWidth,_fillHeight);
        _ctx.translate(randArray(translates),randArray(translates));
        _ctx.fillText(word_question[i],_fillWidth,_fillHeight);

        var _imgData = _ctx.getImageData(0,0,_offset,_offset);
        ctx.putImageData(_imgData,_offset*i,0);
    }



    for(var i=0;i<word_list.length;i++){
        var _canv = new canvas(offset,offset);
        var _ctx=_canv.getContext("2d");
        var _rotate = randArray(rotates);
        var _reversal = _rotate>-120?false:true; //是否反转
        _ctx.textBaseline="top";
        _ctx.textAlign="start";
        if(_reversal){
            _ctx.textBaseline="bottom";
            _ctx.textAlign="end";
        }
        _ctx.fillStyle = randArray(colors);
        /*
         //线
         _ctx.beginPath();
         _ctx.lineTo(randNum(offset), randNum(offset));
         _ctx.lineTo(randNum(offset),randNum(offset));
         _ctx.stroke();
         */
        _ctx.font = randArray(fontsizes).toString()+"px "+randArray(fonts);
        _ctx.scale(randArray(scales),randArray(scales));

        _ctx.rotate(_rotate*Math.PI/180);

        var _te = _ctx.measureText(word_list[i]);
        var _fillWidth = (offset-_te["width"])/2;
        var _fillHeight = _te["emHeightAscent"]+(offset-(_te["emHeightAscent"]+_te["emHeightDescent"]))/2;
        if(_reversal){
            _fillWidth *= -1;
            _fillHeight = 0;
        }
        _ctx.fillText(word_list[i],_fillWidth,_fillHeight);
        _ctx.translate(randArray(translates),randArray(translates));
        _ctx.fillText(word_list[i],_fillWidth,_fillHeight);

        var _imgData = _ctx.getImageData(0,0,offset,offset);
        ctx.putImageData(_imgData,offset*i,offset);
    }
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.lineJoin="round";
    ctx.moveTo(randNum(word_list.length*30),randNum(offset));
    ctx.lineTo(randNum(word_list.length/2*30),randNum(offset));
    ctx.lineTo(randNum(word_list.length*30),randNum(offset));
    ctx.stroke();

    return canv;
}

exports.getCap =function(number){
    return drawCaptcha(createCaptcha(number))
};


