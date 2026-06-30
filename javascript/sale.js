document.addEventListener("DOMContentLoaded", () => {
    // 1. 무료 플러그인 등록
    gsap.registerPlugin(MotionPathPlugin);

    // 2. 초기 화면 셋팅 (인트로 등장 전 준비)
    gsap.set(".container", { opacity: 1 });
    gsap.set("#plane", { opacity: 0, scale: 0.5 });
    gsap.set(".confetti span", { opacity: 0, x: 0, y: 0 });
    
    // 본문 레이아웃은 처음에 숨겨둠
    gsap.set("header, main, footer", { opacity: 0, visibility: "hidden" });

    // 3. 인트로 애니메이션 타임라인 제작
    let introTl = gsap.timeline();
    
    introTl.addLabel("explode", 0.8)
           .addLabel("flight", 1.0)
           
           // 타이틀 글자 쿵 떨어지는 효과 (CustomBounce 대용)
           .from("#main", { duration: 1.2, opacity: 0, y: -200, ease: "bounce.out" })
           
           // 텍스트 좌우로 튕겨 나가는 효과 (SplitText 대용)
           .from("#free", { duration: 0.8, x: -100, opacity: 0, ease: "back.out(1.7)" }, "explode")
           .from("#all", { duration: 0.8, x: 100, opacity: 0, ease: "back.out(1.7)" }, "explode")
           
           // 비행기 등장 및 움직임
           .set("#plane", { opacity: 1 }, "flight")
           .to("#plane", {
               duration: 1.5,
               x: 200,
               y: -50,
               scale: 1.2,
               ease: "power2.inOut"
           }, "flight")
           
           // 폭죽 터지는 효과 (Physics2D 대용 무작위 사방 퍼짐)
           .set(".confetti span", { opacity: 1 }, "explode")
           .to(".confetti span", {
               duration: 1.2,
               x: "random(-200, 200)",
               y: "random(-150, -300)",
               rotation: "random(-360, 360)",
               opacity: 0,
               ease: "power2.out",
               stagger: 0.05
           }, "explode");

    // 4. 마스터 타임라인 (인트로 완료 후 본문 열기)
    let masterTl = gsap.timeline();
    
    masterTl.add(introTl) 
            // 🌟 검은색 인트로 화면을 부드럽게 없애기
            .to("#intro-overlay", { duration: 0.6, opacity: 0, display: "none", ease: "power2.inOut" }, "+=0.2")
            
            // 본문 화면 켜기 (투명도는 0인 상태 유지)
            .set("header, main, footer", { visibility: "visible" })
            
            // 🌟 fromTo()를 사용하여 시작(opacity: 0)과 끝(opacity: 1)을 명확히 지정!
            .fromTo("header", { y: -40, opacity: 0 }, { duration: 0.5, y: 0, opacity: 1, ease: "power3.out" })
            .fromTo("main", { y: 40, opacity: 0 }, { duration: 0.6, y: 0, opacity: 1, ease: "power3.out" }, "-=0.2")
            .fromTo("footer", { y: 20, opacity: 0 }, { duration: 0.5, y: 0, opacity: 1, ease: "power2.out" }, "-=0.2")
            
            // 헤더 배경색 바꾸는 보너스 효과
            .to("header", { 
                duration: 0.5, 
                backgroundColor: "#fd4f6e", 
                ease: "power1.inOut" 
            }, "+=0.1");
});