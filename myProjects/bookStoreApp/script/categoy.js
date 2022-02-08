// to delete books
$('.deletebook').on('click',()=>{
    var val = $(this).attr('value')
    $.ajax({
        url:'/deleteproduct'+val,
        type:"delete",
        dataType:'json',
        contentType:'application/json',
        success:(msg)=>{
            if (msg=='deleted'){
                location.reload()
            }
        }
    })
})