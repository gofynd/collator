import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { NgProgress } from 'ngx-progressbar';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  public ELEMENT = [];
  public columns = [];
  public count = 0;
  public max = 0;
  public is_append;

	displayedColumns = [];
	//request_status = "Authenticating .."

	dummy_params = {"visual-search": {"prediction_url": "http://ml-staging-vision.addsale.com/visual-search",
                                    "query_image_urls": JSON.stringify(
                                      ["https://d2zv4gzhlr4ud6.cloudfront.net/media/pictures/tagged_items/540x0/235_M11MO003DHS/1.jpg",
                                      "https://d2zv4gzhlr4ud6.cloudfront.net/media/pictures/tagged_items/540x0/274_MCSS17D075271/1.jpg",
                                      "https://d2zv4gzhlr4ud6.cloudfront.net/media/pictures/tagged_items/270x0/385_DWPLZ819/1_1505472380456.jpg",
                                      "https://d2zv4gzhlr4ud6.cloudfront.net/media/pictures/tagged_items/540x0/44_GAMAO@NATUREL01/1.jpg"], null, "\t"),
                                    "query_params": JSON.stringify({"is_category": [false],
                                                                   "is_pattern": [false],
                                                                   "is_color": [true,false],
                                                                   "limit":[3]},
                                                                   null, "\t")},
                  "colors": {"prediction_url": "http://ml-staging-vision.addsale.com/api/open/v1/prediction/",
                              "query_image_urls": JSON.stringify(
                                ["https://d2zv4gzhlr4ud6.cloudfront.net/media/pictures/tagged_items/270x0/385_DWPLZ819/1_1505472380456.jpg",
                                "https://d2zv4gzhlr4ud6.cloudfront.net/media/pictures/tagged_items/270x0/455_HGR0616118/1.jpg"], null, "\t"),
                              "query_params": JSON.stringify({"close_crop":[false], "quality":[1,2]}, null, "\t")}
  };

  models = Object.keys(this.dummy_params);

  selectedModel:string = "visual-search";

  prediction_url = this.dummy_params[this.selectedModel]["prediction_url"];
  query_image_urls = this.dummy_params[this.selectedModel]["query_image_urls"];
  query_params = this.dummy_params[this.selectedModel]["query_params"];

  constructor(public ngProgress: NgProgress) {
  }

  modelSelected(){
    this.prediction_url = this.dummy_params[this.selectedModel]["prediction_url"];
    this.query_image_urls = this.dummy_params[this.selectedModel]["query_image_urls"];
    this.query_params = this.dummy_params[this.selectedModel]["query_params"];
  }

	ngOnInit() {
		//postrequest(auth_url, auth_creds, this)
	}

	addItem(is_append){
	//if(this.request_status=="Authenticated"){
    //this.ngProgress.start();
		var rows = JSON.parse(this.query_image_urls);
		var columns = JSON.parse(this.query_params);

		var columns_combinations = this.getCombinations(columns, 0, [], {});
		this.displayedColumns=["image"];
    if(!this.is_append){
		  this.ELEMENT = [];
    }
    var initial_length = this.ELEMENT.length;

		this.max = columns_combinations.length*(rows.length+initial_length);
		this.count = initial_length*columns_combinations.length;
		for (let i in columns_combinations){
			var hors = columns_combinations[i];
			var column_name = JSON.stringify(hors).replace(/['"]+/g,"").replace("{","");
			column_name = column_name.replace("}","");
			this.displayedColumns.push(column_name);
			for (let j in rows){
				var vert = rows[j];
				var params={"image_url":vert, "model_name":this.selectedModel};
				params = Object.assign({}, params, hors);
				this.postrequest(this.prediction_url, params, (parseInt(j)+initial_length).toString(), column_name, this);
			}

		}
		//this.request_status == "Requesting ..";

	//}
	}
	
	getCombinations(options, optionIndex, results, current) {
	    var allKeys = Object.keys(options);
	    var optionKey = allKeys[optionIndex];

	    var vals = options[optionKey];

	    for (var i = 0; i < vals.length; i++) {
	        current[optionKey] = vals[i];

	        if (optionIndex + 1 < allKeys.length) {
	            this.getCombinations(options, optionIndex + 1, results, current);
	        } else {
	            // The easiest way to clone an object.
	            var res = JSON.parse(JSON.stringify(current));
	            results.push(res);
	        }
    }
    if(results.length==0){
      results=options;
    }

    return results;
	}


	onresponse(xhr, url, params, i, j, context) {
    var row;
    if (xhr.readyState === 4){
      context.count++;
      context.ngProgress.set(context.count/context.max);
       if (xhr.status === 200) {
        var json = JSON.parse(xhr.responseText)["data"];
        if(url.indexOf("voldemort") !== -1){
          context.request_status = "Authenticated";
        } else{
          //context.request_status = "Success";
          if(context.selectedModel=="colors"){
            row = this.postprocesscolor(json);
          } else if(context.selectedModel=="visual-search"){
            row = this.postprocessvisualsearch(json);
          }
          if (typeof context.ELEMENT[i] == 'undefined'){
            context.ELEMENT[i]={};
          }
          context.ELEMENT[i][j]=row;
          context.ELEMENT[i]['image'] = params['image_url'];

          if(context.count==context.max){
            context.ngProgress.done();
           context.dataSource = new MatTableDataSource(context.ELEMENT);
          }
        }
        console.log(json);
      }
    }
	}

  postprocesscolor(json){
    let row={};
    row['values']=[];
    for(let k in json){
      var values=json[k];
      values['rgbValue']=values['rgb'].toString();
      if ((values['rgb'][0]*0.299 + values['rgb'][1]*0.587 + values['rgb'][2]*0.114) > 186){
         values['rgbTextColor'] = '#000000';
       }else {
         values['rgbTextColor'] = '#ffffff';
       }
       row['values'].push(values);
    }
    return row;
  }

  postprocessvisualsearch(json){
    let row=json[0];
    return row;
  }

 

	postrequest(url, params, i, j, context){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = () => { 
      this.onresponse(xhr, url, params, i, j, context);
    };
		var data = JSON.stringify(params);
		xhr.send(data);
	}

}

