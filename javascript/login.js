$(function(){
    $(".login_select").on("click", function(){
        $(this).addClass("selected")
        $(".join_select").removeClass("selected")
        $(".login_container").addClass("on")
        $(".join_container").removeClass("on")
    })
    $(".join_select").on("click", function(){
        $(this).addClass("selected")
        $(".login_select").removeClass("selected")
        $(".join_container").addClass("on")
        $(".login_container").removeClass("on")
    })
})

// ===== 로그인 =====
const loginBtn = document.querySelector(".login_inputbox button");
if (loginBtn) {
    loginBtn.addEventListener("click", function () {
        const id = document.getElementById("user_id").value.trim();
        const pw = document.getElementById("user_pw").value.trim();
        const keep = document.getElementById("keep").checked;

        if (!id || !pw) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.email === id && u.pw === pw);

        if (!user) {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
            return;
        }

        const userData = { email: user.email, name: user.name };

        if (keep) {
            localStorage.setItem("currentUser", JSON.stringify(userData));
        } else {
            sessionStorage.setItem("currentUser", JSON.stringify(userData));
        }

        alert(`${user.name}님, 환영합니다!`);
        window.location.href = "./index.html";
    });
}

// ===== 회원가입 =====
const joinBtn = document.querySelector(".join_btn");
if (joinBtn) {
    // 전체 동의 체크박스
    const termAll = document.getElementById("term_all");
    const termItems = document.querySelectorAll(".term_item");

    if (termAll) {
        termAll.addEventListener("change", function () {
            termItems.forEach((item) => (item.checked = termAll.checked));
        });

        termItems.forEach((item) => {
            item.addEventListener("change", function () {
                termAll.checked = [...termItems].every((i) => i.checked);
            });
        });
    }

    joinBtn.addEventListener("click", function () {
        const email = document.getElementById("join_email").value.trim();
        const name = document.getElementById("join_name").value.trim();
        const pw = document.getElementById("join_pw").value.trim();
        const pwConfirm = document.getElementById("join_pw_confirm").value.trim();
        const requiredTerm = document.querySelectorAll(".term_item")[0];

        if (!email || !name || !pw || !pwConfirm) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        if (pw.length < 8 || pw.length > 16) {
            alert("비밀번호는 8~16자로 입력해주세요.");
            return;
        }

        if (pw !== pwConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (requiredTerm && !requiredTerm.checked) {
            alert("필수 약관에 동의해주세요.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.find((u) => u.email === email)) {
            alert("이미 사용 중인 이메일입니다.");
            return;
        }

        users.push({ email, name, pw });
        localStorage.setItem("users", JSON.stringify(users));

        alert(`${name}님, 가입이 완료됐습니다! 로그인 해주세요.`);
        window.location.href = "./login.html";
    });
}