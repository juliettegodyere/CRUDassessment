
jQuery("document").ready(function(){
    $("#loginForm").validate({
        rules: {
            firstName:{
                minlength:8,
                required:true
            },
            lastName:{
                required:true,
                email:true
            },

            gender:{
                minlength:6,
                required:true
            },
            dob:{
                minlength:6,
                required:true
                
            }
            
        },
        messages:{
            firstName: {
                required: "Please enter a username",
                minlength: "Your username must consist of at least 8 characters"
            },
            lastName: "Please enter a valid email address",
            
             gender: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long"
            },
            dob: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long",
                
            }
            
        },
         submitHandler: function (form) { // for demo
            alert('valid form');
            return false;
        }

        
    });

});