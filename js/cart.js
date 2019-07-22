/*********************************************\
 * 					定义全局变量                             *
\*********************************************/
//当前用户
var user;

window.onload = function(){
	
	//取出当前用户
	$.ajax({
		type:"get",
		url:"http://localhost:8080/currUser",
		dataType:'json',
		async:true,
		xhrFields: {
			withCredentials: true
		},
		rossDomain: true,
		success:function(res){
			if(res.data != null){
				user=res.data;
				//发送请求，取出购物车记录
				$.ajax({
					type:"post",
					url:"http://localhost:8080/cart/showCart/"+user.username,
					async:true,
					xhrFields:{withCredentials:true},
					success:function(res){
						if (res.data === 14) {
							alert("获取购物车记录失败 ！");
						} else{
							//获取购物车记录成功
							var cart_item = res.data.data;
					
							if(cart_item.length === 0){
								alert("购物车空空如也 ！");
								return;
							}
							for (var i = 0; i < cart_item.length ; i++) {
								var newul = document.createElement("div");
							    newul.innerHTML = '<ul class="cart_list_td clearfix">'+
									'<li class="col01"></li>'+
									'<li class="col02"><img src="" class="item_img"></li>'+
									'<li class="col03"><a>'+ cart_item[i].title +'</a><br><em>'+ cart_item[i].price/100.0 +'元/500g</em></li>'+
									'<li class="col04">500g</li>'+
									'<li class="col05">'+ cart_item[i].price/100.0 +'元</li>'+
									'<li class="col06">'+
										'<div class="num_add">'+
												'<input type="button" value="+" onclick="increase(this);" style="height: 28px;width: 29px;"/>'+
								       			'<input style="text-align: center;" type="text" size="3" readonly class="num_show fl" value="1"/>'+ 
								       			'<input type="button" value="-" onclick="decrease(this);" style="height: 28px;width: 29px;"/>'+	
										'</div>'+
									'</li>'+
									'<li class="col07">'+ cart_item[i].price/100.0+'元</li>'+
									'<li class="col08"><input type="button" value="删除" onclick="drop(this);"/></li>'+
								'</ul>';	
								var ul = document.getElementById("cart");
								ul.appendChild(newul);
								//修改图片地址
								var img = document.getElementsByClassName("item_img");
								img[i].setAttribute("src",cart_item[i].image);	
							}
							sum();
						}
					}
				});
			}else{
				alert("获取数据异常");
				return;
			}
		}
	 });	
}
function increase(btn){
    var div = btn.parentNode;
    var text = div.getElementsByTagName("input")[1];
	var amount = text.value;
	text.value = ++amount;
	//获取单价
	var li = div.parentNode.parentNode.getElementsByTagName("li")[4];
	var price = parseFloat(li.innerHTML);
	//计算单项金额
	var muy = price* parseFloat(amount);
	var li_6 = div.parentNode.parentNode.getElementsByTagName("li")[6];
	li_6.innerHTML = muy.toFixed(2)+"元";
	sum();
}
function decrease(btn){
	var div = btn.parentNode;
    var text = div.getElementsByTagName("input")[1];
	var amount = text.value;
	if(amount<1){
		text.value = 0;
	}
	if(amount>0){
		text.value = --amount;
	}
	//获取单价
	var li = div.parentNode.parentNode.getElementsByTagName("li")[4];
	var price = parseFloat(li.innerHTML);
	//计算单项金额
	var muy = price*parseFloat(amount);
	var li_6 = div.parentNode.parentNode.getElementsByTagName("li")[6];
	li_6.innerHTML = muy.toFixed(2)+"元";
	sum();
}
function drop(btn){
	var item = btn.parentNode.parentNode.parentNode;
	var cart = document.getElementById("cart");
	
	//*******发请求，从购物车移除该记录*****
	
	//获取当前用户、要删除的商品名
	var curr_user = user.username;
	var del_item_title = btn.parentNode.parentNode.getElementsByTagName("li")[2].getElementsByTagName("a")[0].innerHTML;
	$.ajax({
		type:"post",
		url:"http://localhost:8080/cart/deleteCart",
		data:JSON.stringify({
			'username':curr_user,
			'title':del_item_title
		}),
		async:true,
		dataType:'json',
		contentType:"application/json; charset=utf-8",
		xhrFields:{withCredentials:true},
		success:function(res){
			if (res.data === 13) {
				console.log("删除成功");
			} else{
				console.log("删除失败");
			}
		}
	});
	
	//页面移除
	cart.removeChild(item);
	sum();
}
//计算总金额
function sum() {
	var s = 0;
	var cart_area = document.getElementById("cart");
	var cart_ul = cart_area.getElementsByTagName("ul");
	for(var i = 0 ; i < cart_ul.length; i++) {
		var mny = cart_ul[i].getElementsByTagName("li")[6].innerHTML;
		//累加
		s += parseFloat(mny);
	}
	//将合计值写入合计列(id="total")
	var total = document.getElementById("total");
	total.innerHTML = s.toFixed(2);
	//将商品总件数写入
	var num = document.getElementById("num");
	num.innerHTML = cart_ul.length;
}

//结算窗口
	$(document).ready(function() {
		$('#settlement').click(function() {
			if (parseInt(document.getElementById("total").innerHTML) === 0) {
				alert("没有可支付商品");
				return;
			}
			//信息和数值需要获取后台数据
			$.ajax({
				type:"get",
				url:"http://localhost:8080/selectUser/"+user.username,
				dataType:'json',
				async:true,
				xhrFields: {
					withCredentials: true
				},
				rossDomain: true,
				success:function(res){
					if(res.data != null){
						var user=res.data;
						document.getElementById("user_name").value=user.name;
						document.getElementById("user_phone").value=user.phone;
						document.getElementById("user_place").value=user.address;
						document.getElementById("money").value= document.getElementById("total").innerHTML;						
					}else{
						alert("结算失败 !");
					}
				}
		    });
			$('#place_order').toggle();
			$('#shadow').toggle();
			
		});
	});
//关闭结算窗口
	$(document).ready(function() {
		$('#closePlace_order').click(function() {
			$('#place_order').toggle();
			$('#shadow').toggle();
		});
	});