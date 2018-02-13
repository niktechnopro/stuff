console.log('loading pagescroll');
//reading submit button by attribute
let $submitButton = $('[submitButton]');
var $form = $('[formReset]')[0];//referencing my table here
// As per the HTML5 Specification
// var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]){2,}$/;
var emailRegExp = /^[a-zA-Z0-9._#!&%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
    // calculating the header style
    var headerHeight = $('.header').outerHeight();
    console.log('Header height', headerHeight)
    var scrollLink = $('.scroll');
    scrollLink.click(function(e){ //e refers that there is an event
    	e.preventDefault();//preventing default action=hard jump
    	// calculating position of secsion
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
        let name = $('[name = "name"]').val().trim()
        let email = $('[name = "email"]').val().trim()
        let message = $('[name = "textarea"]').val().trim()
        //making an object with info
        let data = {
            name : name,
            email : email,
            message : message
        }
        console.log('reading info from fields', data)
        //checking if email is correct
        if (name === ""){
            console.log("the name field is empty")
            swal({
                title: "it seems that name field is empty",
                text: "please type your name",
                icon: "error",
                button: "OK!"
                }).then((result)=>{
                    console.log(result)   
                })
        }
        else if (email === "" || !email.match(emailRegExp)){
            console.log('email is incorrect')
            // $('[name="email"]').val('please retype correct email').css('color','purple')
            // $('[name = "email"]').on('focus',function(){
            //     $(this).val("");
            // });
            swal({
                title: "it seems that something's wrong with email",
                text: "please check and retype your email",
                icon: "error",
                button: "OK!"
                }).then((result)=>{
                    console.log(result)   
                })
        }else{
            console.log('email is correct')
            //clearing fields
            // console.log($form)
            $form.reset()
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
                        title: "Thank You For Your Interest! \nI'll get back to you shortly",
                        text: "Press OK button",
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
            }
    })

});