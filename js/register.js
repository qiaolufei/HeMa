$(function(){

	var error_name = false;
	var error_password = false;
	var error_check_password = false;


	$('#user_name').blur(function() {
		check_user_name();
	});

	$('#pwd').blur(function() {
		check_pwd();
	});

	$('#cpwd').blur(function() {
		check_cpwd();
	});

	function check_user_name(){
		var phone = $('#user_name').val();
		if(!(/^1[34578]\d{9}$/.test(phone)))
		{
			$('#user_name').next().html('号码格式错误')
			$('#user_name').next().show();
			error_name = true;
		}
		else
		{
			$('#user_name').next().hide();
			error_name = false;
		}
	}

	function check_pwd(){
		var len = $('#pwd').val().length;
		if(len<8||len>20)
		{
			$('#pwd').next().html('密码最少8位，最长20位')
			$('#pwd').next().show();
			error_password = true;
		}
		else
		{
			$('#pwd').next().hide();
			error_password = false;
		}		
	}


	function check_cpwd(){
		var pass = $('#pwd').val();
		var cpass = $('#cpwd').val();

		if(pass!=cpass)
		{
			$('#cpwd').next().html('两次输入的密码不一致')
			$('#cpwd').next().show();
			error_check_password = true;
		}
		else
		{
			$('#cpwd').next().hide();
			error_check_password = false;
		}		
		
	}


	$('#regist').click(function() {
		check_user_name();
		check_pwd();
		check_cpwd();

		if(error_name == false && error_password == false && error_check_password == false)
		{
			$.ajax({
		        type: "POST",
		        url: "http://localhost:8080/addUser",
		        data: JSON.stringify({
		        	'username':$("#user_name").val(), 
		        	'password':$("#pwd").val()
		        }),
				async: true,
			    dataType:'json',
			    contentType:"application/json; charset=utf-8",
				xhrFields:{withCredentials:true},
		       	success: function(res) {
		     		if (res.data === 13) {
		     			alert("注册成功");
		     			location.href = "login.html";
		     		} else{
		     			if (res.data === 15) {
		     				alert("该手机号已注册");
		     			} else{
		     				alert("注册失败");
		     			}
		     		}
		        },
    		});
		}
		else
		{
			alert("注册失败");
		}

	});








})