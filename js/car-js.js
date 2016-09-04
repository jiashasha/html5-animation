/**
*定义变量
*/
var dx=5,		//当前速率
rate=1,			//当前播放速度
ani,			//当前动画循环
c,				//画图（canvas context）
w,				//汽车[隐藏]（canvas context）
grassHeight=130,//背景高度
carAlpha=0,		//轮胎旋转角度
carX=-400,		//x轴方向上汽车的位置（初始位置，会改变）
carY=300,		//y轴方向上汽车的位置（常量，不会改变）
carWidth=400,	//汽车的宽度
carHeight=130,	//汽车的高度
tiresDelta=15,	//轮胎到最近的汽车底盘的距离
axisDelta=20,	//汽车底部底盘的轴与轮胎的距离
radius=60;		//轮胎的半径

/**
*实例化汽车canvas（刚开始隐藏）
*/
(function(){
	var car=document.createElement('canvas');	//创建元素
	car.height=carHeight+axisDelta+radius;		//设置高度
	car.width=carWidth;							//设置宽度
	w=car.getContext('2d');
})();

/**
*play：定时重复执行“画汽车”的操作，模拟“帧播放”
*/
function play(s){	//参数s是一个button 
	if(ani){	//如果ani不为null，则代表我们当前已经有了一个动画 
	clearInterval(ani);	//所以我们需要清除它(停止动画) 
	ani=null;	
	s.innerHTML='Play';	//重命名该按钮为“播放” 
	}else{ 
		ani=setInterval(drawCanvas,40);	//我们将设置动画为25fps[帧每秒]，40/1000，即为二十五分之一 
		s.innerHTML='Pause';	//重命名该按钮为“暂停” 
	} 
}
/**
*加减速，通过改变移动距离的大小来实现
*/
function speed(delta){ 
	var newRate=Math.max(rate+delta,0.1); 
	dx=newRate/rate*dx; 
	rate=newRate;
}

/**
*页面加载初始化
*init()
*/
function init(){
	c=document.getElementById('canvas').getContext('2d');
	drawCanvas();
}
/**
*主调方法
*drawCanvas()
*/

function drawCanvas(){ 
	c.clearRect(0,0,c.canvas.width, c.canvas.height);	//清除Canvas(已显示的)，避免产生错误 
	c.save();	//保存当前坐标值以及状态，对应的类似“push”操作 
	drawGrass();	//画背景 
	c.translate(carX,0);	//移动起点坐标 
	drawCar();	//画汽车(隐藏的canvas) 
	c.drawImage(w.canvas,0,carY);	//画最终显示的汽车
	c.restore();	//恢复Canvas的状态，对应的是类似“pop”操作 
	carX+=dx;	//重置汽车在X轴方向的位置，以模拟向前走 
	carAlpha+=dx/radius;	//按比例增加轮胎角度 
	if(carX>c.canvas.width){	
	//设置某些定期的边界条件 
	carX=-carWidth-10;	//也可以将速度反向为dx*=-1; 
	} 
}
/**
*背景
*/

function drawGrass(){ 
	//创建线性渐变，前两个参数为渐变开始点坐标，后两个为渐变结束点坐标 
	var grad=c.createLinearGradient(0,c.canvas.height-grassHeight,0,c.canvas.height); //为线性渐变指定渐变色，0表示渐变起始色，1表示渐变终止色 
	grad.addColorStop(0,'#33CC00'); 
	grad.addColorStop(1,'#66FF22'); 
	c.fillStyle=grad; 
	c.lineWidth=0; 
	c.fillRect(0,c.canvas.height-grassHeight,c.canvas.width,grassHeight); 
}
/**
*车身
*/
function drawCar(){ 
	w.clearRect(0,0,w.canvas.width,w.canvas.height);	//清空隐藏的画板 
	w.strokeStyle='#FF6600';	//设置边框色 
	w.lineWidth=2;	//设置边框的宽度，单位为像素 
	w.fillStyle='#FF9900';	//设置填充色 
	w.beginPath();	//开始绘制新路径 
	w.rect(0,0,carWidth,carHeight);	//绘制一个矩形 
	w.stroke();	//画边框 
	w.fill();	//填充背景 
	w.closePath();	//关闭绘制的新路径 
	drawTire(tiresDelta+radius,carHeight+axisDelta);	//我们开始画第一个轮子 
	drawTire(carWidth-tiresDelta-radius,carHeight+axisDelta);	//同样的，第二个 
}

/**
*轮胎
*/
function drawTire(x,y){ 
	w.save(); 
	w.translate(x,y); 
	w.rotate(carAlpha); 
	w.strokeStyle='#3300FF'; 
	w.lineWidth=1; 
	w.fillStyle='#0099FF'; 
	w.beginPath(); 
	w.arc(0,0,radius,0,2*Math.PI,false); 
	w.fill(); 
	w.closePath(); 
	w.beginPath();
	w.moveTo(radius,0); 
	w.lineTo(-radius,0); 
	w.stroke(); 
	w.closePath(); 
	w.beginPath(); 
	w.moveTo(0,radius); 
	w.lineTo(0,-radius); 
	w.stroke(); 
	w.closePath(); 
	w.restore(); 
}
