console.log("loading carousel")

function autoSpin(){
	var currentSlide = 0;
	var current = $(".carousel").attr("slide-number")
	currentSlide = parseInt(current);
	(currentSlide === 4) ? currentSlide=1 : currentSlide += 1;
	$(".carousel").attr("slide-number", `${currentSlide}`);
}

const timer = setInterval(autoSpin, 3000);
