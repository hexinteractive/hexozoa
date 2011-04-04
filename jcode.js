
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
		  // '-webkit-box-shadow': function(){return '0 0 6px 2px #'+self.color;},
			'background-color': function(){return '#'+self.color;},
			'top': function(){return t },
			'left': function(){return l }
		})).appendTo('#box');
	})(this);
}


Hexozoa.prototype.swim = function(radian){
	
	var top = parseInt($(this.element).css('top'));
	var left = parseInt($(this.element).css('left'));
	
	var info = this.interpretGene(this.hexgenes[1]);//interpretGeneing on each swim call is really inefficient 
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
  //todo: call copyGene in loop
  var newGenes = [];
  for(var i=0;i<this.hexgenes.length;i++) {
    newGenes.push( this.copyGene(this.hexgenes[i]) );
  }

  //todo: pass copied genes into constructor
  //var hG = '#' + this.hexgenes.join('#');
  var hG = '#' + newGenes.join('#');
  c[len] = new Hexozoa(hG,coord);
	c[len].swim();
}
Hexozoa.prototype.interpretGene = function(hexgene) {
	var array = hexgene.split('');
	var rgb = {
		'r': parseInt(''+array[0]+array[1], 16),
		'g': parseInt(''+array[2]+array[3], 16),
		'b': parseInt(''+array[4]+array[5], 16)
	}
	return rgb;
}
Hexozoa.prototype.copyGene = function(hexgene) {
  
  var hG = this.interpretGene(hexgene);
  //loop through genes and mutate slightly
  var rand = Math.random()*10000000000000001;//the full int //the seed of it all.
  var ter = rand.toString(3);//get a base three number for mutating up or down by 1.
      ter = ter.substr(0,9);// a nine digit tertiary number

  console.log('hexgenes',this.hexgenes);
  console.log('orgHex',hexgene);
  console.log('orgRGB', hG.r +' '+ hG.g +' '+ hG.b);
  var rand_str = rand.toString(10);
  var zeros = '000';//string of zeros for prepending to values
  var r_str = hG.r.toString(10);// change int value 45 to '45' string for manipulation
      r_str = zeros.substr(0,3 - r_str.length) + r_str;//prepend correct number of zeros to string to always make it a three digit number '045'
  var g_str = hG.g.toString(10);
      g_str = zeros.substr(0,3 - g_str.length) + g_str;
  var b_str = hG.b.toString(10);
      b_str = zeros.substr(0,3 - b_str.length) + b_str;
  console.log('strRGB', r_str +' '+ g_str +' '+ b_str);
  console.log('strHex', (parseInt(r_str,10)).toString(16) +' '+ (parseInt(g_str,10)).toString(16) +' '+ (parseInt(b_str,10)).toString(16));
  console.log('before and after match', hexgene ==  (parseInt(r_str,10)).toString(16) + (parseInt(g_str,10)).toString(16) + (parseInt(b_str,10)).toString(16));    
  

/*=======================================*/ 
    var r_copy = g_copy = b_copy = '';
  for(var i=0;i<3;i++) {
    
    console.log(('r_str.charAt('+i+') == rand_str.charAt('+i+')'),(r_str.charAt(i) +' == '+ rand_str.charAt(i)));
    if(r_str.charAt(i) == rand_str.charAt(i)) {
      var x = parseInt(r_str.charAt(i),10);
      var y = ( parseInt(ter.charAt(i),10)-1 );
      console.log(r_copy +' += '+x+' + '+y );
      r_copy += x + y  ;
    } else {
      console.log(r_copy +' += '+ r_str.charAt(i) );
      r_copy += r_str.charAt(i);
    }
    /*************************************************/
    console.log(('g_str.charAt('+i+') == rand_str.charAt('+i+')'),(g_str.charAt(i) +' == '+ rand_str.charAt(i)));
    if(g_str.charAt(i) == rand_str.charAt(i)) {
      var x = parseInt(g_str.charAt(i),10);
      var y = ( parseInt(ter.charAt(i),10)-1 );
      console.log(g_copy +' += '+x+' + '+y );
      g_copy += x + y  ;
    } else {
      console.log(g_copy +' += '+ g_str.charAt(i) );
      g_copy += g_str.charAt(i);
    }
    /*************************************************/
    console.log(('b_str.charAt('+i+') == rand_str.charAt('+i+')'),(b_str.charAt(i) +' == '+ rand_str.charAt(i)));
    if(b_str.charAt(i) == rand_str.charAt(i)) {
      var x = parseInt(b_str.charAt(i),10);
      var y = ( parseInt(ter.charAt(i),10)-1 );
      console.log(b_copy +' += '+x+' + '+y );
      b_copy += x + y  ;
    } else {
      console.log(b_copy +' += '+ b_str.charAt(i) );
      b_copy += b_str.charAt(i);
    }
        
      // r_copy += r_str.charAt(i) == rand_str.charAt(i) ? ( r_str.charAt(i)+(parseInt(ter.charAt(i),10)-1) ) : r_str.charAt(i);
      // g_copy += g_str.charAt(i) == rand_str.charAt(i+3) ? ( g_str.charAt(i)+(parseInt(ter.charAt(i+3),10)-1) ) : g_str.charAt(i);
      // b_copy += b_str.charAt(i) == rand_str.charAt(i+6) ? ( b_str.charAt(i)+(parseInt(ter.charAt(i+6),10)-1) ) : b_str.charAt(i);
    }
  console.log('copied RGB', (parseInt(r_copy,10) +' '+ parseInt(g_copy,10) +' '+ parseInt(b_copy,10)))
  return  (parseInt(r_copy,10)).toString(16) + (parseInt(g_copy,10)).toString(16) + (parseInt(b_copy,10)).toString(16);
  //return (parseInt(r_str,10)).toString(16) + (parseInt(g_str,10)).toString(16) + (parseInt(b_str,10)).toString(16);
  
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
	    var zeros = '000';//string of zeros for prepending to values
      var r_str = (parseInt(Math.random() * 255, 10)).toString(16);
          r_str = zeros.substr(0,2 - r_str.length) + r_str;
      var g_str = (parseInt(Math.random() * 255, 10)).toString(16);
          g_str = zeros.substr(0,2 - g_str.length) + g_str;
      var b_str = (parseInt(Math.random() * 255, 10)).toString(16);
          b_str = zeros.substr(0,2 - b_str.length) + b_str;
	    console.log('#'+'|'+ r_str +'|'+ g_str +'|'+ b_str)
			return '#'+ r_str + g_str + b_str;
	},
	genesis: function(seedSize) {
		seedSize = (typeof seedSize == 'number') ? seedSize : 10;
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
		  if(!bioreactor.creatures[index].dead){
		    bioreactor.creatures[index].element.addClass('kill');
  			delete bioreactor.creatures[index].element;
		  }
		});

		$('#box').addClass('boom');
		setTimeout(function(){$('.kill').remove()},100);
		setTimeout(function(){$('#box').removeClass('boom')},100);
		bioreactor.creatures = [];
		bioreactor.stalking = null;
	},
	start_stalking: function(elem) {
		if(!$(elem).hasClass('hexozoa')) {return}//if you didnt click on a bug get out.
		this.stop_stalking();
   	var i = 0, 
   	    c = bioreactor.creatures, 
   	    len = c.length,
   	    elemID = $(elem).attr('id');
   	for(i; i<len; i++){
   	  if(!c[i].dead && c[i].id == elemID){
   	    // bioreactor.stalking = c[i];
   	    bioreactor.stalking = i;
   	    $('#box').addClass('tagged')
   	    setTimeout(function(){$('#box').removeClass('tagged')},50);
   	    $('#btn_spawn, #btn_kill').removeAttr('disabled' );
       	bioreactor.stalk();
   			break;
   	  }
   	}

	},
	stalk: function() {
		if(typeof console == 'undefined') {return;}
    // console.log(bioreactor.stalking.health);
    console.log(bioreactor.creatures[bioreactor.stalking].health);
	},
	stop_stalking: function() {
	  bioreactor.stalking = null;
	  $('#btn_spawn, #btn_kill').attr('disabled',true);
	},
	kill: function() {
	  var s = bioreactor.stalking;
	  if(s !== null) {
	    var c = bioreactor.creatures;
      delete c[s].element;
      $('#'+c[s].id).remove();
      delete c[s];
      c[s] = {dead:true}; 
      bioreactor.stop_stalking();
    }
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
$('#btn_spawn').click(function(){ if(bioreactor.stalking !== null) {(bioreactor.creatures[bioreactor.stalking]).spawn();} });
$('#btn_kill').click(function(){ if(bioreactor.stalking !== null) {bioreactor.kill();} });

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
    case 75://k
      btn = $('#btn_kill');
    break;
    default:
      if(console){console.log('The "'+ String.fromCharCode(e.which) +'" ('+ e.which +') key has been pressed, but its not one of the keys I care about.')}
    break;
  }
  if(typeof btn != 'undefined'){btn.trigger('click');}
});
	
		
$('#box').click(function(evt){
 bioreactor.start_stalking(evt.target);
});
	
	
});//end of ready








