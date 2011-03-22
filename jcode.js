
/*
what i learned lastnight. javascript's' number.toString() accepts a radix. 
http://www.w3schools.com/jsref/jsref_tostring_number.asp

var dec = 255;
var hex = dec.toString(16);
parseInt(hex,16);
*/


$(document).ready(function(){

//setInterval((function(){$('body').trigger('tick')}),500);

function Hexozoa(hexgenes,coord) {
	this.hexgenes = hexgenes.split('#').slice(1);//split the hexgenes into an array of hexcodes without the # and removes the first item which is empty.
	this.dob = new Date();
	this.id = this.dob.getTime();
	this.health = 1;
	this.color = this.hexgenes[0];
	this.element = (function(self) {
	  
	  //if(typeof coord == 'object' && typeof coord.x == 'number' && typeof coord.y == 'number')
	  var t,l;
	  if(typeof coord == 'object'){//lets assume that if a coord is passed that it has x & y that are numbers
	    t = coord.y;
	    l = coord.x;
	  } else {
	     t = parseInt(Math.random() * bioreactor.height);
	     l = parseInt(Math.random() * bioreactor.width);
	  }
	  
		return ($('<i id="'+ self.id +'" class="hexozoa" style="background-color:#'+ self.color +';"></i>').css({
			'background-color': function(){return '#'+self.color;},
			'top': function(){return t },
			'left': function(){return l }
		})).appendTo('#box');
	})(this);
}


Hexozoa.prototype.swim = function(radian){
	
	var top = parseInt($(this.element).css('top'));
	var left = parseInt($(this.element).css('left'));
	
	var info = this.interpret(this.hexgenes[1]);//interpreting on each swim call is really inefficient 
	var dur = (Math.random() * 200) + info.g;
	var dist = parseInt(info.b/25,10);
	var self = this;
	//decrease health a bit 
	this.health -= 0.00001;
	
	//var alpha = -45 * (Math.PI/180);
	//if a radian was passed into the swim func then use it else generate a random angle (6.2rad is the complete circle)
	radian = (typeof radian == 'number') ? radian : (Math.random() * 6.2);
	//define alpha and update the value of radian to pass to the swim func on completion
	//subtract .5 from random to allow L & R turns  
	
	
	var alpha = (radian = radian + (Math.random() - .5));
		
		/*
		//random (0-1) plus RED (0-255) divided by 255 divided by 2 (that makes the value range 0-1) minus .5 (which makes the value range -0.5 to 0.5)
		var alpha = radian = radian + ( ( (Math.random() + ( info.r / 255 ) ) / 2 ) - .5);
		if(this === bioreactor.creatures[6]){console.log('delta radian: ', ( ( (Math.random() + ( info.r / 255 ) ) / 2 ) - .5))}
		*/
		//var alpha = radian = radian + ( (Math.random() - .5)     ( info.r / 255 ) ) / 2 )      );
	
	
	//ra_2_de = value * (180 / pi);
	//de_2_ra = value * (pi / 180);
		
	

		
	var hypotenuse = dist;
	var a = Math.sin(alpha) * hypotenuse;/*top*/
	var b = Math.cos(alpha) * hypotenuse;/*left*/
	
	/*
	var triangle = {
		'hypotenuse':hypotenuse,
		'a':a,
		'b':b,
		'alpha':alpha,  
		'beta':beta,
		'gamma':gamma,
		'top':top,
		'left':left
	}
	console.log(triangle);
	*/
	
	
	var minEdge = dist;
	var minPos = Math.min(Math.min(top,left), minEdge);
	if( minPos != minEdge) {//find the lowest coord value then find the lowest value between the lowest coord and minEdge if outcome isnt equal to minEdge then 
		//dist = 1;
		a = (a < 0) ? 0 : a;
		b = (b < 0) ? 0 : b;
		alpha = (radian = radian + ((Math.random() - 0.5) * 1.5) );
	}

	var maxEdge = bioreactor.width - dist;//assuming height & width are always equal I used width
	if( Math.max(maxEdge, Math.max(top,left)) != maxEdge) {
		//dist = 1;
		a = (a > 0) ? 0 : a;
		b = (b > 0) ? 0 : b;
		alpha = (radian = radian + ((Math.random() - 0.5) * 1.5) );
	}
	
	
	
	$(this.element).animate({'top':(top+a), 'left':(left+b)}, {'duration':dur, 'easing':'easeInOutElastic', 'complete': (function(){self.swim(radian)}) })
	
	$(this.element).css({
		'-moz-transform': 'rotate('+ radian +'rad)',
		'-o-transform': 'rotate('+ radian +'rad)',
		'-webkit-transform': 'rotate('+ radian +'rad)'
	});
	
}
//mitosis
Hexozoa.prototype.spawn = function(){
  var c = bioreactor.creatures;
  var pos = $(this.element).position();
  var coord = {x:pos.left, y:pos.top};
  var len = c.length;
  var hG = '#' + this.hexgenes.join('#');
  //loop through genes and mutate slightly
  //bioreactor.genesis(2);
  //bioreactor.stalking.spawn();
  //r = Math.random();
  //d = parseInt(r * 1000,10);
  //d.toString(3);
  console.log('hG',hG);
  c[len] = new Hexozoa(hG,coord);
	c[len].swim();
}
Hexozoa.prototype.interpret = function(hexgene) {
	var array = hexgene.split('');
	var rgb = {
		'r': parseInt(''+array[0]+array[1], 16),
		'g': parseInt(''+array[2]+array[3], 16),
		'b': parseInt(''+array[4]+array[5], 16)
	}
	return rgb;
}
Hexozoa.prototype.eat = function(){
	//eat to increase health
	//increase health a bit 
	this.health += 0.00015;
}


window.bioreactor = {
	height: $('#box').height(),
	width: $('#box').width(),
	creatures: [],
	stalking: null,
	randomHexgene: function() {
			return '#'+ (parseInt(Math.random() * 255, 10)).toString(16) + (parseInt(Math.random() * 255, 10)).toString(16) + (parseInt(Math.random() * 255, 10)).toString(16);
	},
	genesis: function(seedSize) {
		seedSize = (typeof seedSize == 'number') ? seedSize : 20;
		seedSize = bioreactor.creatures.length + seedSize + 1;
		for(var i=bioreactor.creatures.length; i<seedSize; i++) {

			var numberOfGenes = 2;
			var hexgenes = [];
			for(var hG=0; hG<=1; hG++) {
				hexgenes[hG] = bioreactor.randomHexgene();
			}
			bioreactor.creatures[i] = new Hexozoa(hexgenes.join(''));
			bioreactor.creatures[i].swim();
		}
	},
	ele: function() {/* Extinction-Level Event */
		$(bioreactor.creatures).each(function(index){
			bioreactor.creatures[index].element.addClass('kill');
			delete bioreactor.creatures[index].element;
		});

		$('#box').addClass('boom');
		setTimeout(function(){$('.kill').remove()},100);
		setTimeout(function(){$('#box').removeClass('boom')},100);
		bioreactor.creatures = [];
	},
	start_stalking: function(elem) {
		
	},
	stalk: function() {
		if(typeof console == 'undefined') {return;}
		console.log(bioreactor.stalking.health);
	},
	approx_distance: function(dx,dy )
  {//http://www.flipcode.com/archives/Fast_Approximate_Distance_Functions.shtml
     var min, max, approx;
     if ( dx < 0 ) {dx = -dx;}
     if ( dy < 0 ) {dy = -dy;}

     if ( dx < dy ){
        min = dx;
        max = dy;
     } else {
        min = dy;
        max = dx;
     }
     approx = ( max * 1007 ) + ( min * 441 );
     if ( max < ( min << 4 ) ){
        approx -= ( max * 40 );
      }
     // add 512 for proper rounding
     return (( approx + 512 ) >> 10 );
  }
	
	
};//end of bioreactor obj


//interface
$('#btn_genesis').click(function(){bioreactor.genesis()});
$('#btn_ele').click(bioreactor.ele);
$('#btn_spawn').click(function(){bioreactor.stalking.spawn();});

$(document).keydown(function(e){
  var btn;
  switch(e.which){
    case 83://s
      btn = $('#btn_spawn');
    break;
    case 71://g
      btn = $('#btn_genesis');
    break;
    case 69://e
      btn = $('#btn_ele');
    break;
    default:
      if(console){console.log(e.which)}
    break;
  }
  if(typeof btn != 'undefined'){btn.trigger('click');}
});
	
		
$('#box').click(function(evt){
  console.log('clicked');
	if(!$(evt.target).hasClass('hexozoa')) {return}
	console.log('clicked a hexozoa',evt.target);
	var i = 0, 
	    c = bioreactor.creatures, 
	    len = c.length,
	    tID = $(evt.target).attr('id');
	for(i; i<len; i++){
	  if(c[i].id == tID){
	    bioreactor.stalking = bioreactor.creatures[i];
			break;
	  }
	}
	bioreactor.stalk();
});
	
	
});//end of ready








