
/*
what i learned lastnight. javascript's' number.toString() accepts a radix. 
http://www.w3schools.com/jsref/jsref_tostring_number.asp

var dec = 255;
var hex = dec.toString(16);
parseInt(hex,16);
*/




$(document).ready(function(){

//setInterval((function(){$('body').trigger('tick')}),500);

function randomHexgene() {
	return '#'+ (parseInt(Math.random() * 255, 10)).toString(16) + (parseInt(Math.random() * 255, 10)).toString(16) + (parseInt(Math.random() * 255, 10)).toString(16);
}

function Hexozoa(hexgenes) {
	this.hexgenes = hexgenes.split('#').slice(1);//split the hexgenes into an array of hexcodes without the # and removes the first item which is empty.
	this.dob = new Date();
	this.id = this.dob.getTime();
	this.health = 1;
	this.color = this.hexgenes[0];
	this.element = (function(self) {
		return ($('<i id="'+ this.id +'" class="hexozoa" style="background-color:#'+ this.color +';"></i>').css({
			'background-color': function(){return '#'+self.color;},
			'top': function(){return parseInt(Math.random() * $('#box').height()) },
			'left': function(){return parseInt(Math.random() * $('#box').width()) }
		})).appendTo('#box');
	})(this);
}

Hexozoa.prototype.swim = function(radian){
	
	var info = this.interpret(this.hexgenes[1]);
	var dur = (Math.random() * 200) + info.g;
	var dist = parseInt(info.b/25,10);
	var self = this;
	
	
	
	//var alpha = -45 * (Math.PI/180);
	//if a radian was passed into the swim func then use it else generate a random angle (6.2rad is the complete circle)
	radian = typeof radian == 'number' ? radian : (Math.random() * 6.2);
	//define alpha and update the value of radian to pass to the swim func on completion
	//subtract .5 from random to allow L & R turns  
	var alpha = radian = radian + (Math.random() - .5);
		
		/*
		//random (0-1) plus RED (0-255) divided by 255 divided by 2 (that makes the value range 0-1) minus .5 (which makes the value range -0.5 to 0.5)
		var alpha = radian = radian + ( ( (Math.random() + ( info.r / 255 ) ) / 2 ) - .5);
		if(this === window.creatures[6]){console.log('delta radian: ', ( ( (Math.random() + ( info.r / 255 ) ) / 2 ) - .5))}
		*/
			//var alpha = radian = radian + ( (Math.random() - .5)     ( info.r / 255 ) ) / 2 )      );
		

	var hypotenuse = dist;
	var a = Math.sin(alpha) * hypotenuse;
	var b = Math.cos(alpha) * hypotenuse;
	
	var top = parseInt($(this.element).css('top'));
	var left = parseInt($(this.element).css('left'));
	
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
	
	$(this.element).animate({'top':(top+a), 'left':(left+b)}, {'duration':dur, 'easing':'easeInOutElastic', 'complete': (function(){self.swim(radian)}) })
	
	$(this.element).css({
		'-moz-transform': 'rotate('+ radian +'rad)',
		'-o-transform': 'rotate('+ radian +'rad)',
		'-webkit-transform': 'rotate('+ radian +'rad)'
	});
	
}
Hexozoa.prototype.spawn = function(){}
Hexozoa.prototype.interpret = function(hexgene) {
	var array = hexgene.split('');
	var rgb = {
		'r': parseInt(''+array[0]+array[1], 16),
		'g': parseInt(''+array[2]+array[3], 16),
		'b': parseInt(''+array[4]+array[5], 16)
	}
	return rgb;
}


window.bioreactor = {
	height: $('#box').height(),
	width: $('#box').width(),
	creatures: [],
	randomHexgene: function() {
			return '#'+ (parseInt(Math.random() * 255, 10)).toString(16) + (parseInt(Math.random() * 255, 10)).toString(16) + (parseInt(Math.random() * 255, 10)).toString(16);
	},
	genesis: function(seedSize) {
		seedSize = bioreactor.creatures.length + seedSize + 1;
		for(var i=bioreactor.creatures.length; i<seedSize; i++) {

			var numberOfGenes = 2;
			var hexgenes = [];
			for(var hG=0; hG<=1; hG++) {
				hexgenes[hG] = randomHexgene();
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
	}
	
	
};

// window.creatures = [];
// window.genesis = function genesis(seedSize) {
// 	seedSize = window.creatures.length + seedSize + 1;
// 	for(var i=window.creatures.length; i<seedSize; i++) {
// 		
// 		var numberOfGenes = 2;
// 		var hexgenes = [];
// 		for(var hG=0; hG<=1; hG++) {
// 			hexgenes[hG] = randomHexgene();
// 		}
// 		window.creatures[i] = new Hexozoa(hexgenes.join(''));
// 		window.creatures[i].swim();
// 	}
// } 
// genesis(20);

// window.ele = function ele () { /* Extinction-Level Event */
// 	$(window.creatures).each(function(index){
// 		window.creatures[index].element.addClass('kill');
// 		delete window.creatures[index].element;
// 	});
// 	
// 	$('#box').addClass('boom');
// 	setTimeout(function(){$('.kill').remove()},100);
// 	setTimeout(function(){$('#box').removeClass('boom')},100);
// 	window.creatures = [];
// }




	bioreactor.genesis(20);
	$('#btn_genesis').click(function(){bioreactor.genesis(20)});
	$('#btn_ele').click(bioreactor.ele);

});