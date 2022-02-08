// for dropdown list
$('li.dropdown').hover(()=>{
    $(this).find('.dropdown-menu').stop(true,true).delay(100).fadeIn(500) ;

},
()=>{
    $(this).find('.dropdown-menu').stop(true,true).delay(100).fadeOut(500) ;
});
// go to category type page
$('.bookpage').on('click',()=>{
    var categorytype = $(this).attr('value');
    window.location = '/categorytype/'+categorytype;
})
// to update data
$('#updatedata').on('click',()=>{
    var data = {
        name: $("#username").val(),
        emailid:$("#useremail").val(),
        password:$("#userpassword").val(),
        phonenumber:$("usernumber").val()
    }
    if(data.name==''||data.emailid==''||data.password==''||data.phonenumber==''){
        $('#updatemessage').append('<div class="alert alert-success mt-4 mr-4 ml-4" role="alert">' + "Input Should not be empty" + "</div>")
        return false
    }
    else if (data.password.length<6){
        $('#updatemessage').append('<div class="alert alert-success mt-4 mr-4 ml-4" role="alert">' + "Password length should be greater than 6 " + "</div>")
        return false
    }
    else if(data.phonenumber.length!=10){
        $('#updatemessage').append('<div class="alert alert-success mt-4 mr-4 ml-4" role="alert">' + "Invalid phonenumber" + "</div>")
        return false
    }
    else{
        $.ajax({
            url:'/updateprofile',
            type:'post',
            contentType:'application/json',
            dataType:'json',
            data:JSON.stringify(data),
            success:(message)=>{
                $('#updatemessage').append('<div class="alert alert-success mt-4 mr-4 ml-4" role="alert">' + "Successfully Updated" + "</div>")
                location.reload()
            }
        })
    }
})

