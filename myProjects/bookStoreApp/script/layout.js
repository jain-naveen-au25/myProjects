// opening dropdown menu
$('li.dropdown').hover(()=> {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(500);
}, ()=> {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(500);
});
// go to privacy page
$(".privacy").on('click',()=>{
    window.location = '/privacy';

})
// go to about page
$(".aboutpage").on('click',()=>{
    window.location='/about'
})
// go to terms page
$(".terms").on("click",  ()=> {
    window.location = '/terms';
});
// go to contact page
$(".contactpage").on("click", ()=> {
    window.location = '/contact';
});
// go to book page
$('.bookpage').on('click',()=>{
    var category=$(this).attr(value);
    window.location='/category/'+category;
})
// search the value
$(".search-button").on("click", ()=> {
    var ele = $('.search').val();
    window.location = '/search/' + ele;
});
// add to cart
$(".store").on('click',(req,res)=>{
    var cartid =$(this).attr('value')
    var username=$("#username").value();
    $.ajax({
        url:'/addbook'+cartid,
        type:'post',
        dataType:'json',
        success:(msg)=>{
            if (msg=="Do login"){
                window.location.replace('/ligin')
            }
            else if (msg=="inserted"){
                var value = document.querySelector('#counter').innerHTML
                val=parseInt(value)+1;
                document.getElementById(counter).innerText=val
            }
            else if (msg=="Already in cart"){
                alert('Already in Cart')
            }
        }

    })
})
// to delete product
$('.deleteproduct').on('click',()=>{
    var deleteitem=$(this).attr('value')
    $.ajax({
        url:'/deleteproduct'+deleteitem,
        type:'put',
        dataType:'json',
        success:()=>{
            if (msg=="deleted"){
                location.reload()
            }
        }
    })
})
// change book quantity
$(document).on('change',".Bookquantity",()=>{
    var id = $(this).attr("book_qua");
    var quant=$(this).find(":selected").text();
    $.ajax({
        url:'/book/'+quant+'/'+id,
        type:'put',
        datatype:'json',
        success:(msg)=>{
            if (msg=="updated"){
                location.reload()
            }
        }
    })
})
// to logout
$('.logout').on('click',  ()=> {
    var username = $("#username").val();
    window.location = '/' + username + '/logout';
})
// to update data
$('#updatedata').on('click', ()=> {
    var data = {
        name: $("#username").val(),
        emailid: $("#useremail").val(),
        password: $("#userpassword").val(),
        phonenumber: $("#usernumber").val(),
    }
    var result = JSON.stringify(data)
    
    $.ajax({
        url: '/updateprofile/' + result,
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: (message)=> {
            if (message == 'updated') {
                $('#updatemessage').append('<div class="alert alert-success mt-4 mr-4 ml-4" role="alert">' + "successfully Updated" + "</div>")
                location.reload()
            }
        }
    });
});

// to buy product
$("#buyproduct").submit(function (e) {
    e.preventDefault();
    var presentDate = new Date();
    var data = {
        name: $('#name').val(),
        mobilenumber: $('#number').val(),
        pincode: $('#pincode').val(),
        landmark: $('#landmark').val(),
        town: $('#town').val(),
        state: $('#state').val(),
        orderData:presentDate
    }
    data = JSON.stringify(data)
    $.ajax({
        url: '/buyproduct/' + data,
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        success: (msg)=> {
            location.replace("/userorders")
        }
    })
});

// to add feedback
$("#Feedback").submit(function (e) {
    e.preventDefault()
    var data = {
        name: $('#name').val(),
        email: $('#email').val(),
        query: $('#exampleFormControlTextarea1').val()
    }
    data = JSON.stringify(data)
    $.ajax({
        url: '/contactdata/' + data,
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        success: function (message) {
            if(message.success){
                $('#successMessage').append('<div class="alert alert-success mt-4 mr-4 ml-4" role="alert">' + "Thank you, will contact you" + "</div>")
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } 
        }
    })
});
// to delete order 
$('.deleteorderproduct').on('click', ()=> {
    var deleteitem = $(this).attr('value')
    
    $.ajax({
        url: '/deleteorderproduct/' + deleteitem,
        type: 'put',
        datatype: 'json',
        success: function (msg) {
            if (msg == "canceled") {
                location.reload()
            }
        }
    })
})

