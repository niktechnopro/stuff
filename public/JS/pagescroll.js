console.log('loading pagescroll')
//reading submit button by attribute
let $submitButton = $('[submitButton]')
// window.onunload = function () {
//     window.scrollTo(0, 0);
// }
$(window).on('beforeunload', function(){
  $(window).scrollTop(-1000); //to reposition page to top on reload
});
$(document).ready(function(){
    //section for isotope
    var $grid = $('.grid').isotope({ // initialization
    itemSelector: '.grid-item',
    layoutMode: 'fitRows'
    });
    //reading from buttons based on attribute
    $('.filter button').click(function(){
      let value = $(this).attr('data-name')
      // console.log(value)
      $grid.isotope({ //filtering what's showing based on value
        filter: value
      })
    })
    //end of section for isotope
    // this portion is only for tooltip
    $('[data-toggle="tooltip"]').tooltip({delay: {show: 400, hide: 100}});  
    // this portion is for smooth scrolling
    var headerHeight = $('.header').outerHeight() - 15;
    var scrollLink = $('.scroll');
    scrollLink.click(function(e){ //e refers that there is an event
    	e.preventDefault();//preventing default action=hard jump
    	let linkRef = $(this).attr('href');
    	//the following will account for header height
    	let position = $(linkRef).offset().top - headerHeight;
    	// console.log("navigation clicked", $(linkRef).offset().top, headerHeight, position);
    	$('html, body').animate({
    		scrollTop : position
    		}, 500)
    	//animate is looking for css property
    	// scrollTop measures how far from top this is 	
    	})
    //the following will collapse mobile navbar after click
    $(".navbar-nav li a").click(function(event) {
    	$(".navbar-collapse").collapse('hide');
	});
	
	$(".clicker").click(function(event) {
		$(".navbar-collapse").collapse('hide');
  	});

    // section for contact form ajax post request
    $submitButton.on('click', (event)=>{
        event.preventDefault()//
        //reading data from fields
        name = $('[name = "name"]').val().trim()
        email = $('[name = "email"]').val().trim()
        message = $('[name = "textarea"]').val().trim()
        //making an object with info
        data = {
            name : name,
            email : email,
            message : message
        }
        //making ajax post request to route /send
        $.ajax({
            url: "/send",
            method: "POST",
            data: data,
            dataType: "JSON"
            
        }).done(result => {
            // console.log("this is done message ", result)
            if (result.message == 'success'){
                swal({
                title: "Thank You For Your Interest!",
                text: "Press OK button to exit",
                icon: "success",
                button: "OK!"
                }).then((result)=>{
                    console.log('back to about-me section')
                    // window.location.href = "#about-me";//redirects back to about-me section
                    //the following will account for header height
                    let position = $('#about-me').offset().top - headerHeight;
                    // console.log("navigation clicked", $(linkRef).offset().top, headerHeight, position);
                    $('html, body').animate({
                        scrollTop : position
                        }, 500)
                })
            }
        })
        .fail(error=>{
            console.log('error ocured: ', error)
        })
        console.log('reading info from fields', data)
    })

});