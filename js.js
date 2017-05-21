

//临时生成一个grids数组
var testGrids=new Array(); //先声明一维 

for(var i=0;i<4;i++){
	testGrids[i]=new Array(); 
	for(var j=0;j<4;j++){
		testGrids[i][j]=i+j;  // 赋值，每个数组元素的值为1或0
	}
}


//输出数组各项
function consoleGrids(Grids){

console.log(Grids[0][0],Grids[0][1],Grids[0][2],Grids[0][3]);
console.log(Grids[1][0],Grids[1][1],Grids[1][2],Grids[1][3]);
console.log(Grids[2][0],Grids[2][1],Grids[2][2],Grids[2][3]);
console.log(Grids[3][0],Grids[3][1],Grids[3][2],Grids[3][3]);
//[x][y]!!!!!!!!这里不规范好，下面一错万错
}
consoleGrids(testGrids);
//alert(grids.length);


	var vector = {
		0: { y: -1, x: 0 },   // Left 37
		1: { y: 0,  x: -1 }, // Up 38
		2: { y: 1,  x: 0 },  // Right 39
		3: { y: 0,  x: 1 },  // Down 40
  };










var isGridsNew=1;


//下面写键位响应操作

document.addEventListener("keydown",function (event) {//这个连法也是挺奇妙的。。但是记住就行了
	
	if (isGridsNew) {
	console.log("new");
	gridsAfter = gridsCalculation(event,testGrids);
	isGridsNew=0;
	consoleGrids(gridsAfter);
	}
	else{
	console.log("continue");
	gridsAfter = gridsCalculation(event,gridsAfter);
	
	}//又出现爆出的bug

	console.log("gridsAfter:");
	consoleGrids(gridsAfter);
})


function gridsCalculation(event,grids){


	var direction =vector[event.which-37];//event.which。。连起来了

//
	
	/*1.求对应位置对应方向上的格数*/


	//以下两个for循环，得到了empty格数。
	var emptyNums=new Array();
	for (var x = 0; x <= 3; x++) {
		emptyNums[x]=new Array();
		for (var y = 0; y <= 3; y++) {
				
			var distance ;//就四句话呗。。暴力if	
			if (direction==vector[2]) distance = 3-y ;//right
			if (direction==vector[0]) distance = y ;//left
			if (direction==vector[3]) distance = 3-x ;//down
			if (direction==vector[1]) distance = x ;//up
			//PS:我居然被两个等号困了半个小时。。f**k
			var emptyNum=0;

			//求emptyNum
			for (var i = 1; i <= distance; i++) {
				//看下这个坐标的问题
				//console.log('y,x,i',y,x,i);
				//console.log('direction.y,direction.x',direction.y,direction.x);
				//console.log('y+i*direction.y][x+i*direction.x',y+i*direction.y,x+i*direction.x)
				//console.log('here?');
				if (grids[x+i*direction.x][y+i*direction.y]==0) emptyNum++;
			}
			emptyNums[x][y]=emptyNum;
		}
	}
	
	//以上，便得到了每格沿direction方向上的empty格数，排布成了一个矩阵。

	var displacement_1=emptyNums;
	//console.log('emptyNums:');
	//consoleGrids(emptyNums);

	

	/*2.移动对应格数，得到移动后的矩阵*/

	

	//direction 0,1 : grids[x][y]移动到[x+direction.x*displacement_1[x][y]][y+direction.y*displacement_1[x][y]]处
	var newGrids_1 = new Array();
	for (var i =0 ; i < 4; i++) {
		newGrids_1[i] = new Array();
		for (var j =0 ; j < 4; j++) {
			newGrids_1[i][j]=0;
		}
	}
	//newGrids_1的初始化。不先初始化的话，下面超前赋值，会出bug。

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grids[i][j]) {	
				//console.log(i+1,j+1,'to',i+direction.x*displacement_1[i][j]+1,j+direction.y*displacement_1[i][j]+1);
				newGrids_1[i+direction.x*displacement_1[i][j]][j+direction.y*displacement_1[i][j]]=grids[i][j]+newGrids_1[i+direction.x*displacement_1[i][j]][j+direction.y*displacement_1[i][j]];			
			}		
		}	
	}
	//console.log('newGrids_1:');
	//consoleGrids(newGrids_1);//successful

	//这样便得到了新的矩阵newgrids_1



	/*3.加入merge，得到merge后的grids*/
	//下面对每个newgrids_1[x][y]沿direction方向检测，判断下一个与自己连2？连3？连4？	
	var mergeTypes_transposition=new Array();
	for (var i = 0; i < 4; i++) {
		mergeTypes_transposition[i]=new Array();
		for (var j = 0; j < 4; j++) {
			mergeTypes_transposition[i][j]=0;
		}
	}

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {

			//开始对每一格进行操作。
			//注意此处ij与xy坐标十分混乱！在这里卡了1h的bug
			var distance=0 ;	
			if (direction==vector[2]) distance = 4-i ;//right
			if (direction==vector[0]) distance = i+1 ;//left
			if (direction==vector[3]) distance = 4-j ;//down
			if (direction==vector[1]) distance = j+1 ;//up
			
			var toMerge=new Array(0,0,0);
			for (var n=1; n<distance; n++) {
				toMerge[n-1]=newGrids_1[j+direction.x*n][i+direction.y*n];
			}
			//得到了某一格该方向上[眼前]的全部元
			//下面进行merge判断
			//mergeTypes_transposition表示有几个连
			if (toMerge[0]&&toMerge[0]==newGrids_1[j][i]) {
				if (toMerge[1]&&toMerge[1]==newGrids_1[j][i]) {
					if (toMerge[2]&&toMerge[2]==newGrids_1[j][i]) {
						mergeTypes_transposition[i][j]=4;
						//console.log(mergeTypes_transposition[i][j]);
					}
					else{
						mergeTypes_transposition[i][j]=3;
						//console.log(mergeTypes_transposition[i][j]);
					}
				}
				else{
					mergeTypes_transposition[i][j]=2;
					//console.log(mergeTypes_transposition[i][j]);
				}
			}
			else{
				mergeTypes_transposition[i][j]=1;
				//console.log(mergeTypes_transposition[i][j]);
			}

		}	
	
	}

	//这里需要为mergeType为1的后续格子加上一个位移

	//consoleGrids(mergeTypes_transposition);//successful，不过要转置一下
	var mergeTypes=new Array();
	for(var i=0;i<4;i++){
 		mergeTypes[i]=new Array();
 		for(var j=0;j<4;j++){
  			mergeTypes[i][j] = mergeTypes_transposition[j][i];
		}
	}
	
	//下面对于不同的mergeTypes情况，实施merge，得到一个新的newGrids_2(即最终位移结果)，同时求因merge而产生的displacement_2

	var newGrids_2=new Array();
	var displacement_2=new Array();
	for (var i = 0; i < 4; i++) {	
			newGrids_2[i]=new Array();
			displacement_2[i]=new Array();
		for (var j = 0; j < 4; j++) {
			newGrids_2[i][j]=0;
			displacement_2[i][j]=0;
		}
	}
	//又要先初始化，否则爆
	
	



	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (mergeTypes[i][j]==1) {
				newGrids_2[i][j]=newGrids_1[i][j]+newGrids_2[i][j];
				displacement_2[i][j]=0;
			}
			if (mergeTypes[i][j]==2) {
				newGrids_2[i+direction.x][j+direction.y]=newGrids_1[i][j]+newGrids_2[i+direction.x][j+direction.y];
				displacement_2[i][j]=1;
			}
			if (mergeTypes[i][j]==3) {
				newGrids_2[i+direction.x][j+direction.y]=newGrids_1[i][j]+newGrids_2[i+direction.x][j+direction.y];
				displacement_2[i][j]=1;
			}
			if (mergeTypes[i][j]==4) {
				newGrids_2[i+2*direction.x][j+2*direction.y]=newGrids_1[i][j]+newGrids_2[i+2*direction.x][j+2*direction.y];
				displacement_2[i][j]=2;
			}
			
		}
	}
//上面得到了粗糙的newGrids_2，displacement_1

//下面重复一次，输入newGrids_2得newGrids_3,displacement_2

//repeat1


//in：newGrids_2  out：newGrids_3,displacement_2
//in：newGrids_2  out：newGrids_3,displacement_2

	
	/*1.求对应位置对应方向上的格数*/


	//以下两个for循环，得到了empty格数。
	var emptyNums=new Array();
	for (var x = 0; x <= 3; x++) {
		emptyNums[x]=new Array();
		for (var y = 0; y <= 3; y++) {
				
			var distance ;//就四句话呗。。暴力if	
			if (direction==vector[2]) distance = 3-y ;//right
			if (direction==vector[0]) distance = y ;//left
			if (direction==vector[3]) distance = 3-x ;//down
			if (direction==vector[1]) distance = x ;//up
			//PS:我居然被两个等号困了半个小时。。f**k
			var emptyNum=0;

			//求emptyNum
			for (var i = 1; i <= distance; i++) {
				//看下这个坐标的问题
				//console.log('y,x,i',y,x,i);
				//console.log('direction.y,direction.x',direction.y,direction.x);
				//console.log('y+i*direction.y][x+i*direction.x',y+i*direction.y,x+i*direction.x)
				//console.log('here?');
				if (newGrids_2[x+i*direction.x][y+i*direction.y]==0) emptyNum++;
			}
			emptyNums[x][y]=emptyNum;
		}
	}
	
	//以上，便得到了每格沿direction方向上的empty格数，排布成了一个矩阵。

	var displacement_2=emptyNums;
	//console.log('emptyNums:');
	//consoleGrids(emptyNums);

	

	/*2.移动对应格数，得到移动后的矩阵*/

	

	//direction 0,1 : newGrids_2[x][y]移动到[x+direction.x*displacement_2[x][y]][y+direction.y*displacement_2[x][y]]处
	var newGrids_3 = new Array();
	for (var i =0 ; i < 4; i++) {
		newGrids_3[i] = new Array();
		for (var j =0 ; j < 4; j++) {
			newGrids_3[i][j]=0;
		}
	}
	//newGrids_3的初始化。不先初始化的话，下面超前赋值，会出bug。

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (newGrids_2[i][j]) {	
				//console.log(i+1,j+1,'to',i+direction.x*displacement_2[i][j]+1,j+direction.y*displacement_2[i][j]+1);
				newGrids_3[i+direction.x*displacement_2[i][j]][j+direction.y*displacement_2[i][j]]=newGrids_2[i][j]+newGrids_3[i+direction.x*displacement_2[i][j]][j+direction.y*displacement_2[i][j]];			
			}		
		}	
	}
	//console.log('newGrids_3:');
	//consoleGrids(newGrids_3);//successful

	//这样便得到了新的矩阵newGrids_3


//

//repeat2
	
//in：newGrids_3  out：newGrids_4,displacement_3
//in：newGrids_3  out：newGrids_4,displacement_3

	
	/*1.求对应位置对应方向上的格数*/


	//以下两个for循环，得到了empty格数。
	var emptyNums=new Array();
	for (var x = 0; x <= 3; x++) {
		emptyNums[x]=new Array();
		for (var y = 0; y <= 3; y++) {
				
			var distance ;//就四句话呗。。暴力if	
			if (direction==vector[2]) distance = 3-y ;//right
			if (direction==vector[0]) distance = y ;//left
			if (direction==vector[3]) distance = 3-x ;//down
			if (direction==vector[1]) distance = x ;//up
			//PS:我居然被两个等号困了半个小时。。f**k
			var emptyNum=0;

			//求emptyNum
			for (var i = 1; i <= distance; i++) {
				//看下这个坐标的问题
				//console.log('y,x,i',y,x,i);
				//console.log('direction.y,direction.x',direction.y,direction.x);
				//console.log('y+i*direction.y][x+i*direction.x',y+i*direction.y,x+i*direction.x)
				//console.log('here?');
				if (newGrids_3[x+i*direction.x][y+i*direction.y]==0) emptyNum++;
			}
			emptyNums[x][y]=emptyNum;
		}
	}
	
	//以上，便得到了每格沿direction方向上的empty格数，排布成了一个矩阵。

	var displacement_3=emptyNums;
	//console.log('emptyNums:');
	//consoleGrids(emptyNums);

	

	/*2.移动对应格数，得到移动后的矩阵*/

	

	//direction 0,1 : newGrids_3[x][y]移动到[x+direction.x*displacement_3[x][y]][y+direction.y*displacement_3[x][y]]处
	var newGrids_4 = new Array();
	for (var i =0 ; i < 4; i++) {
		newGrids_4[i] = new Array();
		for (var j =0 ; j < 4; j++) {
			newGrids_4[i][j]=0;
		}
	}
	//newGrids_4的初始化。不先初始化的话，下面超前赋值，会出bug。

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (newGrids_3[i][j]) {	
				//console.log(i+1,j+1,'to',i+direction.x*displacement_3[i][j]+1,j+direction.y*displacement_3[i][j]+1);
				newGrids_4[i+direction.x*displacement_3[i][j]][j+direction.y*displacement_3[i][j]]=newGrids_3[i][j]+newGrids_4[i+direction.x*displacement_3[i][j]][j+direction.y*displacement_3[i][j]];			
			}		
		}	
	}
	//console.log('newGrids_4:');
	//consoleGrids(newGrids_4);//successful

	//这样便得到了新的矩阵newGrids_4


//

//repeat where









	//至此，已经将所有的位移全部做好



	//下面追踪计算总位移量displacement矩阵
	var displacement=new Array();
	for (var i = 0; i < 4; i++) {
		displacement[i]=new Array();
		for (var j = 0; j < 4; j++) {
			displacement[i][j]=0;
		}
	}//先初始化不用说。
	//consoleGrids(displacement);//successful

	//下面追踪计算位移量




	return newGrids_4
}

