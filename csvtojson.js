const readline = require('readline');
const fs = require('fs');
var header =[],
    jArray1=[],  // Array for foodgrains
    jArray2=[],  // Array for oilseeds
    jArray3=[],  // Array for commercial
    jArray4=[],  // Array for southernStates
    obj1={},     // Objects for foodgrains
    obj2={},     // Objects for oilseeds
    obj3={},     // Objects for commercial
    obj4={},     // Objects for southernStates
    isHeader=true,
    flag1= false,
    flag2= false,
    flag3= false,
    flag4= false;
//Reading the csv file
const reader= readline.createInterface({
	input: fs.createReadStream('Production-Department_of_Agriculture_and_Cooperation_1.csv', 'utf-8')
});
reader.on('line', function(line) {
	var content= line.split(',');
	for(var i=0;i<content.length;i++) {
		if(isHeader) { //loading elements into header array
			header[i]= content[i].trim();
		}
    //foodgrains-------------------->
		else if(content[0].includes('Foodgrains')) {
			if((header[i]=='Particulars')|| (header[i]=='3-2013')) {
        if(content[0].includes('Major')||content[0].includes('Area')||
                    content[0].includes('Foodgrains Production Foodgrains')||
                    content[0].includes('Yield')||content[0].includes('Volume')||
                    content[0].includes('Production Foodgrains Production')){
          break; //stops the Particular iteration
        }
        else {
          flag1= true;
          if(i==0) {
            obj1[header[i]]= content[i]; //key : values
            //console.log(obj);
          }
          else {
            obj1[header[i].replace('3-2013','Quantity in 2013')]= parseFloat(content[i+1].replace('NA',0)); //key : values
            //console.log(obj);
          }
        }
      }
  	}
    //oilseeds-------------------->
    else if(content[0].includes('Oilseeds')) {
      if((header[i]=='Particulars')|| (header[i]=='3-2013')) {
        if(content[0].includes('Major')||content[0].includes('Area')||
                    content[0].includes('Foodgrains Production Foodgrains')||
                    content[0].includes('Yield')||content[0].includes('Volume')||
                    content[0].includes('Production Foodgrains Production')){
          break; //stops the particular iteration
        }
        else {
          flag2= true;
          if(i==0) {
            obj2[header[i]]= content[i]; //key : values
          }
          else {
            obj2[header[i].replace('3-2013','Quantity in 2013')]= parseFloat(content[i+1].replace('NA',0)); //key : values
          }
        }
      }
    }
    //commercial-------------------->
    else if(content[0].includes('Commercial')) {
        if((header[i]=='Particulars')|| (/3-/i.test(header[i]))) {
          flag3= true;
          if(i==0) {
            obj3[header[i]]= content[i]; //key : values
          }
          else {
            var sum=0;
            for(i=3;i<25;i++) {
              content[i]=parseFloat(content[i+1].replace('NA',0));
              sum += parseFloat(content[i]);
            }
            obj3['Year']=sum;
          }
        }
    }
  }
  //southernStates-------------------->
  for(var i=0;i<content.length;i++) {
		if(isHeader) {
			header[i]=content[i].trim();
    }
    else if((header[i]=="Particulars")|| (/3-/i.test(header[i]))) {
      if(content[0].includes("Rice Yield Karnataka") || content[0].includes("Rice Yield Andhra Pradesh") ||
      content[0].includes("Rice Yield Kerala") || content[0].includes("Rice Yield Tamil Nadu") ) {
        if(i==0){
          obj4[header[i]]=content[i];
        }
  			for(i=3;i<25;i++) {
  				obj4[header[i]]=parseFloat(content[i+1].replace("NA",0));
  				sum += parseFloat(content[i]);
        }
  			flag4=true;
  		}
  	}
  }
	if(flag1) {
		jArray1.push(obj1);
  }
  else if (flag2) {
    jArray2.push(obj2);
  }
  else if (flag3) {
    jArray3.push(obj3);
  }
  else if (flag4) {
    jArray4.push(obj4);
  }
	isHeader=false;
  //Writing the JSON file
	fs.writeFileSync('output/foodgrains.json',JSON.stringify(jArray1,null,'\r\n'),'utf-8');
  fs.writeFileSync('output/oilseeds.json',JSON.stringify(jArray2,null,'\r\n'),'utf-8');
  fs.writeFileSync('output/commercial.json',JSON.stringify(jArray3,null,'\r\n'),'utf-8');
  fs.writeFileSync('output/southernStates.json',JSON.stringify(jArray4,null,'\r\n'),'utf-8');
	obj1={};
  obj1={};
  obj2={};
  obj3={};
  obj4={};
});
