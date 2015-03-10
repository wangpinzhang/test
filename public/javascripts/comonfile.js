var RemoveControl=function(elements)
{   var arrObj = new Array();
    var count = elements.length;
    for(var i=0;i<count;i++)
    {
        if(elements[i] == undefined)
            continue;
        var obj = document.createElement('span');
        switch(elements[i].tagName)
        {
            case "INPUT" :
                if (elements[i].name){
                    obj.style.width=elements[i].style.width;
                    obj.className="word_warpbreak";

                    if (elements[i].type=='hidden'){
                        elements[i].parentNode.setAttribute('idd',elements[i].value);
                        if (elements[i].value==1) obj.innerHTML='√';
                        if (elements[i].value==0) obj.innerHTML='';
                    }else
                        obj.innerHTML=elements[i].value;
                }
                break;
            case "TEXTAREA" :
                obj.style.width=elements[i].style.width;
                obj.className="word_warpbreak";
                obj.innerHTML=elements[i].innerHTML;
                elements[i].innerHTML = '';
                break;
            case "SELECT" :
                for(var j=0;j<elements[i].length;j++)
                {
                    if(elements[i][j].selected)
                    {
                        obj.style.width=elements[i].style.width;
                        obj.className="word_warpbreak";
                        obj.innerHTML=elements[i][j].text;
                        break;
                    }
                }
                elements[i].options.length = 0;
                break;
        }
        elements[i].parentNode.appendChild(obj);

    }
    elements.remove();
    //删除表单原控件
   // for(var i=0;i<arrObj.length;i++)
   // {arrObj[i].remove();}
}
//载入菜单内容
var load=function(){
    //url,{id,mdl},{data}
    var args = arguments;
    if (args[2]){var data=args[2];}else{var data={};}
    $.get("/"+args[0],data, function (data, textStatus){
        if (args.length>1){
            //若有activemenu参数，则改变菜单选中状态
            var t=$("#activemenu").val();
            var l=$('#activemodule').val();
            if (t){$("#m"+t).removeClass("active");}
            if (l){$("#m"+l).removeClass("active");}
            $('#m'+args[1].id).addClass('active');
            $('#m'+args[1].mdl).addClass('active');
            $('#ms'+args[1].mdl).addClass('selected');
            $('#activemenu').attr("value",args[1].id);
            $('#activemodule').attr("value",args[1].mdl);
        }
        $('#desktop').html(data);
    });
}

var loaddiv=function(){
    //divname,url,{data}
    var args = arguments;
    if (args[2]){var data=args[2];}else{var data={};}
    $.get("/"+args[1],data, function (data, textStatus){
        $('#'+args[0]).html(data);
    });
}

//表单保存
var savediv=function(){
    //divname,url,{data}
    var args = arguments;
    if (args[2]){var data=args[2];}else{var data={};}
    $.post("/"+args[1],data, function (data, textStatus){
        // $("#desktop").innerHTML = data;
        $('#'+args[0]).html(data);
        $('.alert-success', $('#'+args[0])).show();
    });
}

// 表格编辑保存
var edittr = function(r,tableid,cols){
    for(var i=0; i<cols.length; i++){
        if (cols[i].enable==1){
            var vtd = $('#'+tableid+'_'+r+'_'+cols[i].id);
            var val = vtd.attr('idd');
            vtd.html("");
            if (cols[i].type=='text')
            {
                if (val=='null') val='';
                var inputObj = $("<input type='text'>").attr('name',''+tableid+'_'+r+'_'+cols[i].id)
                .addClass('m-wrap small').val(val).appendTo(vtd);
            }else if(cols[i].type=='select')
            {var inputObj = $("<select>").attr('name',''+tableid+'_'+r+'_'+cols[i].id)
                .addClass('m-wrap small').appendTo(vtd);
                for(var j=0;j<cols[i].options.length;j++){
                    var opt=new Option(cols[i].options[j].val, cols[i].options[j].id);
                    inputObj[0].options.add(opt);
                    if (cols[i].options[j].id==val) opt.selected=true;
                }
            }else if(cols[i].type=='checkbox'){
                if (val=='null') val=0;
                var inputObj = $("<input type='checkbox'>").addClass('m-wrap small').val(1).appendTo(vtd);
                var intureObj = $("<input type='hidden'>").attr('name',''+tableid+'_'+r+'_'+cols[i].id)
                    .val(val).appendTo(vtd);
                inputObj.on('click',function(){intureObj.val(this.checked?1:0);});
                if (val==1) inputObj[0].checked=true;
            }else if (cols[i].type=='textarea')
            {
                if (val=='null') val='';
                var inputObj = $("<textarea>").attr('name',''+tableid+'_'+r+'_'+cols[i].id)
                .addClass('m-wrap small').val(val).appendTo(vtd);
            }
        }
    }
    $('#'+tableid+'_edit_'+r).hide();
    $('#saveall'+tableid).removeClass('disabled');
    $('#'+tableid+'_save_'+r).show();
    // $('#'+tableid+'_cancel_'+r).show();
    //$('#'+tableid+'_del_'+r).hide();
}
var savetr = function(r,tableid){
    var frm=$('#form'+tableid);
    var action='defs/tablepost?tableid='+tableid;
    var data=$("#"+tableid+"_"+r+" :input").serialize();
    $.post(action,data, function (data, textStatus){
        //$('#navtab_'+tableid).click();
        RemoveControl($("#"+tableid+"_"+r+" :input"));
        $('#'+tableid+'_edit_'+r).show();
        $('#'+tableid+'_save_'+r).hide();
    });
}
var canceltr=function(){
    // load('form2',{id:$("#activemenu").val(),mdl:$('#activemodule').val()},{});
}
var deltr = function(r,tableid){
    if (confirm('您确实要删除该记录吗？')){
        var action='defs/delrow?tableid='+tableid+'&recid='+r;
        $.post(action,function (data, textStatus){
            $('#'+tableid+'_'+r).remove();
            //alert('删除成功');
        });
    }
}

var addtr = function(tableid,recid,mid){
    var action='defs/addrow?tableid='+tableid+'&recid='+recid+'&mid='+mid;
    $.post(action,function (data, textStatus){
        $('#navtab_'+tableid).click();
        //alert('增加成功');
    });
}
var editall=function(tableid,cols){
    var trs=$('#'+tableid+' > tbody > tr');
    for(var i=0;i<trs.length;i++){
        edittr(trs.eq(i).attr('idd'),tableid,cols);
    }
}
var delall=function(tableid,recid){
    if (confirm('您确实要删除全部记录吗？')){
        //
    }
}
var refresh=function(tableid){
    $('#navtab_'+tableid).click();//
}
var saveall = function(tableid){
    var frm=$('#form'+tableid);
    var action='defs/tablepost?tableid='+tableid;
    var data=frm.serialize();
    $.post(action,data, function (data, textStatus){
        //$('#tab_'+tableid).html(data);
        $('#navtab_'+tableid).click();
    });
}

