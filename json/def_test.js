({
	tab:{name:'def_test',vname:'def_test',perpage:15,wh:'and :userid=1',ob:'order by id'},
	cols:[{id:'code',title:'编号',type:'text',enable:1},{id:'name',title:'名称',type:'text',enable:1},
		{id:'data1',title:'数据1',type:'select',enable:1,options:[{id:1,val:'第一'},{id:2,val:'第二'},{id:3,val:'第三'}]},
		{id:'data2',title:'数据2',type:'checkbox',enable:1},
		{id:'data3',title:'数据3',type:'textarea',enable:1}],
	dtl:[{id:'def_testdtl',mid:'mid',title:'详细信息'},
        {id:'def_testdtl2',mid:'mid',title:'详细信息2'}]
})