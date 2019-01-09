require("moment-duration-format");
var port = process.env.PORT || 3000;
var express = require("express"); 
var app = express();
var cors = require('cors');
var trigger = require('./src/triggers');
// var aws = require('./src/aws');
// var eks = require('./src/eks');
// var gcp = require('./src/gcp');
// var aks = require('./src/aks');
// var packet = require('./src/packet');
// var gke = require('./src/gke');
var time = require('./src/time-calculate');
// var log_link = require('./src/kibana_log');
var build = require('./src/build');
var dashboard = [], pipelines = [] , aws_job = [], gcp_job = [], azure_job = [], packet_job = [], gke_job = [], eks_job = [], builddata = [], istgt_job = [], cstor_job = [], maya_job = [], jiva_job = [], temp = [];

function main() {
// ------------ build data ---------------------------
// build maya
build.maya_pipeline().then(function(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].name = "maya";
        data[i].commit_url = "https://github.com/openebs/maya/commit/"+data[i].sha;
        var p_id = data[i].id;
        var k = 0;
        if (maya_job != "" && maya_job[k] != undefined) {
            while(maya_job[k][0].pipeline.id !== p_id) {
                k++;
                if(maya_job[k] == undefined) {
                    break;
                }
            }
            if(maya_job[k] != undefined && maya_job[k][0].pipeline.id == p_id) {
                data[i].jobs = maya_job[k];
                k = 0;
            }
        }
    }
    builddata[0] = data;
}).catch(function (err) {
    console.log("maya build pipeline error ->",err);
}).then(function() {
    var index = 0;
    if (builddata[0] != undefined) {
        for(var p = 0; p < builddata[0].length; p++) {
            build.maya_jobs(builddata[0][p].id).then(function(data) {
                data[0]['updated'] = time.calculate(data[0]);
                data[0]['gke_pid'] = trigger.getTriggerID(data[1].web_url, "e2e-gke")
                maya_job[index] = data;
                index++;
            });
        }
    }
}).catch(function (err) {
    console.log("maya build pipeline jobs error ->",err);
}).then(function() {
    // ------------------------------ build jiva ---------------------------
build.jiva_pipeline().then(function(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].name = "jiva";
        data[i].commit_url = "https://github.com/openebs/jiva/commit/"+data[i].sha;
        var p_id = data[i].id;
        var k = 0;
        if (jiva_job != "" && jiva_job[k] != undefined) {
            while(jiva_job[k][0].pipeline.id !== p_id) {
                k++;
                if(jiva_job[k] == undefined) {
                    break;
                }
            }
            if(jiva_job[k] != undefined && jiva_job[k][0].pipeline.id == p_id) {
                data[i].jobs = jiva_job[k];
                k = 0;
            }
        }
    }
    builddata[1] = data;
}).catch(function (err) {
    console.log("jiva build pipeline error ->",err);
}).then(function() {
    var index = 0;
    if (builddata[1] != undefined) {
        for(var p = 0; p < builddata[1].length; p++) {
            build.jiva_jobs(builddata[1][p].id).then(function(data) {
                data[0]['updated'] = time.calculate(data[0]);
                jiva_job[index] = data;
                index++;
            });
        }
    }
}).catch(function (err) {
    console.log("jiva build pipeline jobs error ->",err);
});

}).then(function() {
// ------------------------------ build cstor ---------------------------
build.cstor_pipeline().then(function(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].name = "cStor";
        data[i].commit_url = "https://github.com/openebs/zfs/commit/"+data[i].sha;
        var p_id = data[i].id;
        var k = 0;
        if (cstor_job != "" && cstor_job[k] != undefined) {
            while(cstor_job[k][0].pipeline.id !== p_id) {
                k++;
                if(cstor_job[k] == undefined) {
                    break;
                }
            }
            if(cstor_job[k] != undefined && cstor_job[k][0].pipeline.id == p_id) {
                data[i].jobs = cstor_job[k];
                k = 0;
            }
        }
    }
    builddata[2] = data;
}).catch(function (err) {
    console.log("cstor build pipeline error ->",err);
}).then(function() {
    var index = 0;
    if (builddata[2] != undefined) {
        for(var p = 0; p < builddata[2].length; p++) {
            build.cstor_jobs(builddata[2][p].id).then(function(data) {
                data[0]['updated'] = time.calculate(data[0]);
                cstor_job[index] = data;
                index++;
            });
        }
    }
}).catch(function (err) {
    console.log("cstor build pipeline jobs error ->",err);
});
}).then(function() {
// ------------------------------ build istgt ---------------------------
build.istgt_pipeline().then(function(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].name = "istgt";
        data[i].commit_url = "https://github.com/openebs/istgt/commit/"+data[i].sha;
        var p_id = data[i].id;
        var k = 0;
        if (istgt_job != "" && istgt_job[k] != undefined) {
            while(istgt_job[k][0].pipeline.id !== p_id) {
                k++;
                if(istgt_job[k] == undefined) {
                    break;
                }
            }
            if(istgt_job[k] != undefined && istgt_job[k][0].pipeline.id == p_id) {
                data[i].jobs = istgt_job[k];
                k = 0;
            }
        }
    }
    builddata[3] = data;
    if (builddata[1] != undefined && builddata[2] != undefined && builddata[3] != undefined) {
        temp[0] = builddata[0].concat(builddata[1], builddata[2], builddata[3]);
    } 
}).catch(function (err) {
    console.log("istgt build pipeline error ->",err);
}).then(function() {
    var index = 0;
    if (builddata[3] != undefined) {
        for(var p = 0; p < builddata[3].length; p++) {
            build.istgt_jobs(builddata[3][p].id).then(function(data) {
                data[0]['updated'] = time.calculate(data[0]);
                istgt_job[index] = data;
                index++;
            });
        }
    }
}).catch(function (err) {
    console.log("istgt build pipeline jobs error ->",err);
}).then(function() {
//  Sorting data by their id
if (temp[0] != undefined) {
    temp[0].sort(sort_by('id', true, parseInt));
    function sort_by(field, reverse, primer) {
        var key = primer ? 
            function(x) {return primer(x[field])} : 
            function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
}
});
//sorting end
});

// ------------  Build data End  ------------------------
    dashboard = { "dashboard" : { "build": temp[0] }};
    app.get("/", function(req, res)  {
        res.json(dashboard);
    });
}
app.use(cors());
main();

setInterval(function() {
    main();
},30000 );

app.listen(port, function() {
    console.log("server is listening on port:", port);
});