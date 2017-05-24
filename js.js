
function creatingGrid(x,y,num){
	$("#tile-container").append("<div class='tile position"+x+"-"+y+"'>"+num+"</div>");	
}
function removeGrid(x,y,num){
	$(".tile.position"+x+"-"+y).remove();	
}


//新游戏初始化
var Grids=new Array();

for(var i=0;i<4;i++){
	Grids[i]=new Array(); 
	for(var j=0;j<4;j++){
		Grids[i][j]=0;  
	}
}
Grids=randomCreating(Grids);
Grids=randomCreating(Grids);
//



//输出数组各项
function consoleGrids(Grids){

console.log(Grids[0][0],Grids[0][1],Grids[0][2],Grids[0][3]);
console.log(Grids[1][0],Grids[1][1],Grids[1][2],Grids[1][3]);
console.log(Grids[2][0],Grids[2][1],Grids[2][2],Grids[2][3]);
console.log(Grids[3][0],Grids[3][1],Grids[3][2],Grids[3][3]);
//[x][y]!!!!
}
consoleGrids(Grids);


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
	gridsAfter = gridsCalculation(event,Grids);
	isGridsNew=0;
	}
	else{
	gridsAfter = gridsCalculation(event,gridsAfter);
	
	}
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
				if (grids[x+i*direction.x][y+i*direction.y]==0) emptyNum++;
			}
			emptyNums[x][y]=emptyNum;
		}
	}
	
	//以上，便得到了每格沿direction方向上的empty格数，排布成了一个矩阵。

	var displacement_1=emptyNums;
	
	

	/*2.移动对应格数，得到移动后的矩阵*/

	

	//direction 0,1 : grids[x][y]移动到[x+direction.x*displacement_1[x][y]][y+direction.y*displacement_1[x][y]]处
	var newGrids_1 = new Array();
	for (var i =0 ; i < 4; i++) {
		newGrids_1[i] = new Array();
		for (var j =0 ; j < 4; j++) {
			newGrids_1[i][j]=0;
		}
	}
	//newGrids_1的初始化。
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grids[i][j]) {	
				newGrids_1[i+direction.x*displacement_1[i][j]][j+direction.y*displacement_1[i][j]]=grids[i][j]+newGrids_1[i+direction.x*displacement_1[i][j]][j+direction.y*displacement_1[i][j]];			
			}		
		}	
	}

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
					}
					else{
						mergeTypes_transposition[i][j]=3;
					}
				}
				else{
					mergeTypes_transposition[i][j]=2;
				}
			}
			else{
				mergeTypes_transposition[i][j]=1;
			}

		}	
	
	}


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
	//上面得到了粗糙的newGrids_2，displacement_1()挤合dis,displacement_2()融合

	//下面重复一次，输入newGrids_2得newGrids_3,displacement_3

	//repeat1
	
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
				if (newGrids_2[x+i*direction.x][y+i*direction.y]==0) emptyNum++;
			}
			emptyNums[x][y]=emptyNum;
		}
	}
	
	//以上，便得到了每格沿direction方向上的empty格数，排布成了一个矩阵。

	var displacement_3=emptyNums;
	
	

	/*2.移动对应格数，得到移动后的矩阵*/

	

	//direction 0,1 : newGrids_2[x][y]移动到[x+direction.x*displacement_3[x][y]][y+direction.y*displacement_3[x][y]]处
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
				newGrids_3[i+direction.x*displacement_3[i][j]][j+direction.y*displacement_3[i][j]]=newGrids_2[i][j]+newGrids_3[i+direction.x*displacement_3[i][j]][j+direction.y*displacement_3[i][j]];			
			}		
		}	
	}

	//这样便得到了新的矩阵newGrids_3






	//至此，已经将所有的位移全部做好



//下面追踪计算总位移量displacement矩阵
	var displacement=new Array();
	for (var i = 0; i < 4; i++) {
		displacement[i]=new Array();
		for (var j = 0; j < 4; j++) {
			displacement[i][j]=0;
		}
	}//先初始化不用说。


	//加了一个假移动判定
	var isRealMove=0;
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var i_=displacement_1[i][j]*direction.x+i;
			var j_=displacement_1[i][j]*direction.y+j;
			
			var i__=displacement_2[i_][j_]*direction.x+i_;
			var j__=displacement_2[i_][j_]*direction.y+j_;
			
			var i___=displacement_3[i__][j__]*direction.x+i__;
			var j___=displacement_3[i__][j__]*direction.y+j__;
			

			displacement[i][j]=direction.x ? (i___-i)/direction.x:(j___-j)/direction.y;
			if (!(i==i___&&j==j___)) isRealMove	
		}	
	}
	//下面moving tiles


	$(".tile").addClass("unmoved");
	for (var x = 1; x <= 4; x++) {
		for (var y = 1; y <= 4; y++) {
			if(!displacement[x-1][y-1]) continue;
			var x_=direction.x*displacement[x-1][y-1]+x;
			var y_=direction.y*displacement[x-1][y-1]+y;
			console.log('x,y',x,y,'x_,y_',x_,y_);		
			movingTile(x,y,x_,y_);
		}	
	}
	$(".tile").removeClass("unmoved");
	

	//下面做merge生新

	//假移动是不生新的

	//有merge产生的位置就是displacement_2的对应位置
	for (var x = 1; x <= 4; x++) {
		for (var y = 1; y <= 4; y++) {
		if (!displacement_2[x-1][y-1]) continue;
		//坐标xy：
		var x_=displacement_2[x-1][y-1]*direction.x+x;
		var y_=displacement_2[x-1][y-1]*direction.y+y;
		//其数值大小在newGrids_1[i][j]处
		//数值：
		var num=2*newGrids_1[x-1][y-1];
		
		setTimeout("removeGrid(y_,x_)",101);
		//这里删得太快了会导致动画出bug，最好在上面间隔100ms
		creatingGrid(y_,x_,num);		
		}	
	}

	//最后random生新：
	var newGrids=randomCreating(newGrids_3);
	

	return newGrids
}

function movingTile(x,y,x_,y_) {
	//yx为原坐标，y_ x_为目的坐标
	var toMoveTile=$(".position"+y+"-"+x+".unmoved");
	toMoveTile.addClass("position"+y_+"-"+x_);
	toMoveTile.removeClass("position"+y+"-"+x);
	toMoveTile.removeClass("unmoved");

}


function randomCreating(newGrids_3,){

	var newGrids = new Array();
	for (var i =0 ; i < 4; i++) {
		newGrids[i] = new Array();
		for (var j =0 ; j < 4; j++) {
			newGrids[i][j]=newGrids_3[i][j];
		}
	}
	
	var value = Math.random() < 0.9 ? 2 : 4;

	do{
		var randomX=Math.floor(Math.random()*4);
		var randomY=Math.floor(Math.random()*4);
	}while(newGrids[randomX][randomY])

	
	//定点赋值
	newGrids[randomX][randomY]=value;

	//页面上生成新格
	creatingGrid(randomY+1,randomX+1,value);
	return newGrids
}
