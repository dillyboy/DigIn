routerApp.service('$qbuilder',function($diginengine,filterService){
    this.sync = function(widgetData, cb){        
        var chartType = widgetData.selectedChart.chartType;
        var widType = eval('new ' + chartType.toUpperCase() + '();');
        widProt = new Widget(widType);
        widProt.sync(widgetData, cb);
    }
    
    var Widget = function(wid) {
        this.widget = wid;        
    };
    
    Widget.prototype = {
        sync: function(wid, cb) {
            var q;
            var db;
            //console.log("wid object:"+JSON.stringify(wid));
            if (typeof wid.commonSrc.query != 'undefined'){
            var q = wid.commonSrc.query;}
            if (typeof wid.commonSrc.src.src != 'undefined'){
            var db = wid.commonSrc.src.src;}
            var cl = $diginengine.getClient(db);    
            return this.widget.sync(q,cl,wid, cb);
        }
    };
    
    var HIGHCHARTS = function() {
        function mapResult(cat, res, d, color, name, cb){
            var serArr = [];
            var i = 0;
            for(c in res[0]){
                if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                    if(c != cat){
                        serArr.push({
                            temp: c,
                            name: name[i],
                            data: [],
                            color: color[i]
                        });
                        i++;
                    }                
                }
            }

            //fill the series array
            res.forEach(function(key){
                serArr.forEach(function(ser){

                    if(!d){
                        ser.data.push({
                            name: key[cat],
                            y: parseFloat(key[ser.temp])
                        });
                    }else{
                        ser.data.push({
                            name: key[cat],
                            y: parseFloat(key[ser.temp]),
                            drilldown: true
                        });
                    }                    
                });
            });
            serArr.forEach(function(ser){
                delete ser.temp;
            });
            cb(serArr);
        }

        function setMeasureData(res,measureData){
            var series = [];
            var i = 0;
            var cat = []
                for ( var i = 0; i < measureData.length; i++){
                    cat[i] = measureData[i].origName;
                    measureData[i].data = [];
                }

            for ( c in res[0]){
                if(cat.indexOf(c) == -1 ){
                    var y = c;
                }
            }

            res.forEach(function (key) {
                measureData.forEach(function(data){
                    data.data.push({
                        name: key[y],
                        y: parseFloat(key[data.origName])
                    });
                })
            })

            return measureData;
        }
        
        this.sync = function(q, cl, widObj, cb) {            
            cl.getExecQuery(q, function(res, status, query){
                var cat = "";
                if(status){
                    filterService.filterAggData(res,widObj.commonSrc.src.filterFields);
                    for(c in res[0]){
                        if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                            if(typeof res[0][c] == "string") cat = c;
                        }
                    }

                    if(cat != ""){
                        var color = [];
                        var name = [];
                        for ( var i = 0; i < widObj.highchartsNG.series.length; i++){
                            color.push(widObj.highchartsNG.series[i].color);
                            name.push(widObj.highchartsNG.series[i].name);
                        }
                        mapResult(cat, res, widObj.widData.drilled, color, name, function(data){
                            widObj.highchartsNG.series = data;
                        });
                    }else{
                        var measureData = widObj.highchartsNG.series;
                        widObj.highchartsNG.series = setMeasureData(res,measureData);
                    }

                    if(typeof widObj.widData.drilled != "undefined")
                    {
                        widObj.highchartsNG.options.chart['events'] ={
                            drilldown: function (e) {                                
                                if (!e.seriesOptions) {
                                    console.log('drilled');
                                }
                            },
                            click: function(){
                                //alert('test');
                            }
                        }
                    }
                    widObj.syncState = true;
                    cb(widObj);
                }
            });
        }
    };
    
    var METRIC = function() {
        function setMeasureData(res){
            var val = "";
            for (var c in res) {
                if (Object.prototype.hasOwnProperty.call(res, c)) {
                    val = res[c];
                }
            }
            return val;
        }
        
        this.sync = function(q, cl, widObj, cb) {
            cl.getExecQuery(q, function(res, status, query){
                if(status){
                    widObj.widData.decValue = res[0];
                    widObj.widData.value = convertDecimals(setMeasureData(res[0]),parseInt(widObj.widData.dec)).toLocaleString();
                }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    };
    
    var D3SUNBURST = function(){

        this.sync = function(q, cl, widObj, cb) {
            cl.getHierarchicalSummary(q, function(data, status) {
                if (status){
                    widObj.widData.children = data.children;
                    }
                widObj.syncState = true;                    
                cb(widObj);
            });
        }
    }; 

    var D3HIERARCHY = function(){

        this.sync = function(q, cl, widObj, cb) {
            cl.getHierarchicalSummary(q, function(data, status) {
                if (status){
                    widObj.widData.children = data.children;
                    }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    }; 

    var FORECAST = function(){
        function mapResult(data){
                var dataArray = [];
                var yearArray = [];
                var serObj = [];
                var count = 0;
                var oldYear = moment(data.time[0]).year();
                var newYear = oldYear;
                var newYear;
                var temp;                
                var flag = true;
                var zoneValue;
                var forecastFlag = true;
                for (var i =0;i<data.time.length;i++){
                    if (newYear == oldYear){
                        if (data.actual[i] !== undefined)
                            dataArray.push(data.actual[i]);
                        else{
                            dataArray.push(data.forecast[i]);
                            if (forecastFlag){
                                zoneValue = i;
                            }
                            forecastFlag = false;                              
                        }
                        if (data.time[i+1] !== undefined){
                            newYear = moment(data.time[i+1]).year();                           
                        }else{
                            serObj.push({
                                name: oldYear,
                                zoneAxis: 'x',
                                data: dataArray
                            });
                            yearArray.push(oldYear);                            
                        }
                    }else{
                        forecastFlag = true;
                        if ( zoneValue !== undefined){
                            serObj.push({
                                name: oldYear,
                                data: dataArray,
                                zoneAxis: 'x',
                                zones: [{
                                    value: zoneValue % 12
                                }, {
                                    dashStyle: 'dash'
                                }]
                            });
                        } else{
                            serObj.push({
                                name: oldYear,
                                data: dataArray,
                                zoneAxis: 'x'
                            });                            
                        }
                        zoneValue = undefined;
                        yearArray.push(oldYear);
                        oldYear = newYear;
                        dataArray=[];
                        if (!flag){
                            if (data.actual[i] !== undefined){
                                dataArray.push(data.actual[i]);
                            }
                            else{
                                if (forecastFlag){
                                    zoneValue = i;
                                }
                                dataArray.push(data.forecast[i]);
                                forecastFlag = false;  
                            }
                        }
                        flag = false;
                    }
                }
                console.log(serObj);
                var date = new Date();
                var currYear = moment(date).year();
                var prevYear = currYear-1;
                var currYearIndex = yearArray.indexOf(currYear);
                var prevYearIndex = yearArray.indexOf(prevYear);                
                var finalObj = [];
                var category = [];
                var monthIndex;
                var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                finalObj[0] = serObj[currYearIndex];
                finalObj[1] = serObj[prevYearIndex];
                for(var i=0;i<12;i++){
                    monthIndex = moment(data.time[i]).month();
                    category.push(month[monthIndex]);
                }
            catArr = data.time;            
            dataArray[0] = category;
            dataArray[1] = finalObj
            return dataArray;        
        }

        this.sync = function(q, cl, widObj, cb){
            cl.getForcast(widObj.foreCastObj, function(data, status){
                if (status){
                    dataArray = mapResult(data);
                    widObj.highchartsNG.series = dataArray[1];
                    widObj.highchartsNG.xAxis.categories = dataArray[0];                    
                }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    };


    var BOXPLOT = function(){

        function mapResult(data) {
            var i = 0;
            var observationsData = [];
            var dataOutliers = [];
            var plotCategories = [];
            var dataArray =   [];
            for (var key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    plotCategories.push(key);
                    observationsData.push([
                        data[key].l_w,
                        data[key].quartile_1,
                        data[key].quartile_2,
                        data[key].quartile_3,
                        data[key].u_w
                        ]);
                    data[key].outliers.forEach(function(k) {
                        dataOutliers.push([i, k]);
                    });
                    i++;
                    }
                }

                dataArray[0] = observationsData;
                dataArray[1] = dataOutliers;
                dataArray[2] = plotCategories;
                return dataArray;
        }

        this.sync = function(q, cl, widObj, cb){
            cl.generateboxplot(q, function(data, status){
                if(status){
                    var dataArray = mapResult(data);
                    widObj.highchartsNG.series[0].data = dataArray[0];
                    widObj.highchartsNG.series[1].data = dataArray[1];
                    widObj.highchartsNG.xAxis.categories = dataArray[2];

                }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    };

    var HISTOGRAM = function(){

        function mapResult(data){
            var dataArray = [];
            var histogramPlotcat = [];
            var histogramPlotData = [];
            for ( var key in data){
                console.log(data[key]);
                histogramPlotData.push(parseFloat(data[key][0]));
                var category = data[key].splice(0, 1);
                histogramPlotcat.push(data[key]);
                }
                dataArray[0] = histogramPlotData;
                dataArray[1] = histogramPlotcat;
            return dataArray;         
        }

        this.sync = function(q, cl, widObj, cb){
            cl.generatehist(q, function(data, status){
                if (status){
                    var dataArray = mapResult(data);
                    widObj.highchartsNG.series[0].data = dataArray[0];
                    widObj.highchartsNG.xAxis.categories = dataArray[1];
                }
                widObj.syncState = true;
                cb(widObj);
            });

        }

    };

    var PIVOTSUMMARY = function(){
        this.sync = function(q, cl, widObj, cb){
            cl.getExecQuery(q, function(data, status) {
                widObj.widData.summary = data;
                widObj.syncState = true;
                cb(widObj);                
            }, widObj.limit);
        }
    };

    var BUBBLE = function(){
        var mapResult = function(data,a,b,c){
            var nameArray = [];

            for ( var i = 0; i < data.y.length; i++){
                nameArray[i] = data.c[i];
            }
            var dataArray = [];
            for ( var i = 0; i < data.y.length; i++){
                dataArray.push(
                {
                    x : data.x[i],
                    y : data.y[i],
                    z : data.s[i],
                    xName: a,
                    yName: b,
                    zName: c                      
                });
            }
            var seriesArray = [];
                for ( var i = 0; i < dataArray.length; i++){
                seriesArray.push(
                {
                    name: nameArray[i],
                    data: [dataArray[i]],
                });
                }
                return seriesArray;
        }

        this.sync = function(q, cl, widObj, cb){
            cl.generateBubble(q, function(data, status) {
                if(status){
                        var a = [];
                        var res = q.split("&");
                        for ( var c in res) {
                            if ( res[c].indexOf("x=") > -1 ) {
                                var x = res[c].split("x=");
                            }
                            if ( res[c].indexOf("y=") > -1 ) {
                                var y = res[c].split("y=");
                            }
                            if ( res[c].indexOf("s=") > -1 ) {
                                var z = res[c].split("s=");
                            }                                                
                    }
                    widObj.highchartsNG.series = mapResult(data,x[1],y[1],z[1]);
                }
                widObj.syncState = true;
                cb(widObj);
            });
        }

    }



});