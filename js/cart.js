window.onload = function(){
	
	var user
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
							//alert(cart_item.length);
							for (var i = 0; i < cart_item.length ; i++) {
								var newul = document.createElement("div");
							    newul.innerHTML = '<ul class="cart_list_td clearfix">'+
									'<li class="col01"></li>'+
									'<li class="col02"><img src="" class="item_img"></li>'+
									'<li class="col03">'+ cart_item[i].title +'<br><em>'+ cart_item[i].price/100.0 +'元/500g</em></li>'+
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
	//发请求，从购物车移除该记录
	
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