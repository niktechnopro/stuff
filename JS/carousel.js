//declaring global variables
console.log("carousel is loading")


function autoSpin(){
	var currentSlide = 0;
	var current = $(".carousel").attr("slide-number")
	currentSlide = parseInt(current);
	(currentSlide === 4) ? currentSlide=1 : currentSlide += 1;
	$(".carousel").attr("slide-number", `${currentSlide}`);
	// console.log(currentSlide);
}

const timer = setInterval(autoSpin, 2000);



$('.next').click(function(){
	clearInterval(timer);
	var current = $(".carousel").attr("slide-number");
	currentSlide = parseInt(current);
	(currentSlide === 4) ? currentSlide=1 : currentSlide += 1;
	$(".carousel").attr("slide-number", `${currentSlide}`);
	console.log(currentSlide);
})


$('.prev').click(function(){
	clearInterval(timer);
	var current = $(".carousel").attr("slide-number")
	currentSlide = parseInt(current);
	(currentSlide === 1) ? currentSlide = 4: currentSlide -= 1;
	$(".carousel").attr("slide-number", `${currentSlide}`);
	console.log(currentSlide);
})