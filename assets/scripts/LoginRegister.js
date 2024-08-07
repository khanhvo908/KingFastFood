// --------------------------------------------------------------------------- //
// Xử lí form đăng kí
function register() {
	var btnRegister = document.querySelector('#js-btn-register');
	btnRegister.addEventListener('click', () => {
		var today = new Date();
		var userArray = JSON.parse(localStorage.getItem('user')) || [];
		var gmail = document.getElementById("js-RG_gmail");
		var username = document.getElementById("js-RG_account");
		var password = document.getElementById("js-RG_password");
		var REpassword = document.querySelector('#js-RG_RePassword');
		var RadioOption = document.querySelector("#js-RG_radio");
		var checkAcc = userArray.some(item => item.username === username.value);
		var checkGmail = userArray.some(item => item.gmail === gmail.value);

		if (checkGmail) {
			alert("Đã có người sử dụng gmail này để đăng kí! Vui lòng sử dụng gmail khác!");
		} else if (checkAcc) {
			alert("Đã có người sử dụng tên đăng nhập này rồi!");
		} else {
			if (REpassword.value !== password.value) {
				alert("Mật khẩu và mật khẩu xác nhận phải giống nhau!");
				REpassword.focus();
				return false;
			}

			if (!RadioOption.checked) {
				alert("Bạn phải xác nhận chấp nhận điều khoản của chúng tôi!");
				return false;
			}

			var user = {
				username: username.value,
				password: password.value,
				gmail: gmail.value,
				userType: 'user'
			};

			userArray.push(user);
			localStorage.setItem('user', JSON.stringify(userArray));
			alert("Đăng kí tài khoản thành công! Chúc bạn mua sắm vui vẻ");

			// Đóng form và reset value trong form input
			gmail.value = "";
			username.value = "";
			password.value = "";
			REpassword.value = "";
			RadioOption.checked = false;
		}
	});
}


// --------------------------------------------------------------------------- //
// xử lí sự kiện logout của user
function Handle_LogOut() {
	var isLogin = document.querySelector(".js-isLogin");
	var logout = document.querySelector(".header-navbar-logout");
	var header = document.querySelector(".header");
	var container = document.querySelector(".container");

	isLogin.addEventListener("click", () => {
		logout.classList.add('is-Logout');
		event.stopPropagation();
	})

	logout.onclick = () => {
		window.location.reload(); // sau khi ấn nút thoát thì load lại trang
	}

	// click ra ngoài form logout thì ẩn button logout
	header.addEventListener("click", () => {
		logout.classList.remove('is-Logout');
	})

	container.addEventListener("click", () => {
		logout.classList.remove('is-Logout'); //
	})
}

	// xử lí form login
	function login() {
		var btnLogin = document.querySelector('#js-btn-login');
		btnLogin.addEventListener('click', () => {
			var username = document.getElementById("js-LG_account");
			var password = document.getElementById("js-LG_password");
			var userArray = JSON.parse(localStorage.getItem('user'));

			// kiểm tra tài khoản có tồn tại trong Local Storage hay không
			var checkAcc = userArray.some((item) => item.username == username.value);

		if (!checkAcc) {
			alert("Tên tài khoản không tồn tại !");
		} else {
			for (i = 0; i < userArray.length; i++) {
				if (userArray[i].username == username.value && userArray[i].password != password.value) {
					alert('Sai mật khẩu !');
					break;
				}

				if (userArray[i].username == username.value && userArray[i].password == password.value) {
					document.querySelector(".js-HandlerLR").innerHTML = `
							<i class="header-user--icon far fa-user"></i>
							<span id="js-Username">${userArray[i].username}</span>
							<div class="header-navbar-logout is-absoluted">Đăng xuất</div>
					`;
					document.querySelector(".js-HandlerLR").classList.add('js-isLogin'); // thêm class is_Login
					document.getElementById("LR-form").remove(); // xoá form Login/Register sau khi đăng nhập thành công
					Handle_LogOut(); // gọi lại hàm xử lý sự kiện logout
					formPayment()// hiển thị form đặt hàng
					showListCart(); // hiển thị giỏ hàng
					break;
				}
			}
		}
	});
}

// -----------------------------------------------------------------
// form sẽ hiện ra sau khi đăng nhập thành công
function showListCart() {
	var nameUser = document.getElementById("js-Username").innerText;
	var showPayment = JSON.parse(localStorage.getItem('cartList'));
	var temp = '';
	for (var i = 0; i < showPayment.length; i++) {
		if (showPayment[i].username == nameUser) {
			if (showPayment[i].status == 'confirmed') {
				value = "Đã xác nhận";
				color = "green";
			}

			if (showPayment[i].status == 'pending') {
				value = "Đang xử lí";
				color = "orange";
			}

			if (showPayment[i].status == 'unconfirmed') {
				value = "Đã huỷ";
				color = "red";
			}

			temp += `
			<tr>
				<td style="width: 2%">${i + 1}</td>
				<td style="width: 45%">${showPayment[i].ListNameProducts.join('</br>')}</td>
				<td style="width: 18%">${showPayment[i].dateTime}</td>
				<td style="width: 15%">${showPayment[i].totalMoney.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
				<td id="js-cart-status" style="width: 20%; color: ${color}">${value}</td>
			</tr>
			`;
		}
	}

	document.querySelector('.container__Mycart-listItem').innerHTML = `
		<table id="listProduct">
		<tr>
			<th>STT</th>
			<th>Sản phẩm</th>
			<th>Thời gian</th>
			<th>Tổng tiền</th>
			<th>Trạng thái</th>
		</tr>
		${temp}
		</table>
	`;
}

// --------------------------------------------------------------------------- //
// function hiển thị giỏ hàng trống
function formPayment() {
	document.querySelector('.cartPayment').innerHTML = `
    <div class="container__cart-title">Đơn Hàng hiện tại</div>
    <div class="container__Mycart-wrap">
        <ul class="container__Mycart-listItem">
            <div class="container_Mycart-Temp">
                Hiện tại bạn chưa đặt đơn hàng nào cả :(
            </div>
        </ul>
    </div>`;
}

	login();
	register();
});