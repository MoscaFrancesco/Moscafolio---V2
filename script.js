let locoScroll
function initMagneticButtons() {
    //select all the elements with class magnetic
    const magnets = document.querySelectorAll(".magnetic");
  
    //for each add the two event listener to the closest parent with class OuterMagneticRange
    magnets.forEach((magnet) => {
      const OuterMagneticRange = magnet.closest(".OutRange");
      OuterMagneticRange.addEventListener("mousemove", moveMagnet);
      OuterMagneticRange.addEventListener("mouseleave", resetMagnet);
    });
  
    function moveMagnet(event) {
      //now the event.currentTarget is the parent, we need to select the newbutton
      const magnetButton = event.currentTarget.querySelector(".magnetic");
      const ButtonHam = magnetButton.querySelector("button.menu-btn");
      const hovercolor = magnetButton.querySelector(".hovercolor");
      
      if (hovercolor != null){
        hovercolor.style.height = "100%";
        hovercolor.style.top = "auto";
      }

      //we get dimensions ad apply the effect
      const bounding = magnetButton.getBoundingClientRect();
      const magnetsStrength = parseInt(magnetButton.dataset.strength, 10);
      const magnetsStrengthText = parseInt(magnetButton.dataset.strengthText, 10);
  
      gsap.to(magnetButton, 1.5, {
        x:
          ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
          magnetsStrength,
        y:
          ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
          magnetsStrength,
        rotate: "0.001deg",
        ease: "power4.out"
      });



      if (ButtonHam != null){
      gsap.to(ButtonHam, 1.5, {
        x:
          ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
          magnetsStrengthText,
        y:
          ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
          magnetsStrengthText,
        rotate: "0.001deg",
        ease: "power4.out"
      });
      }
    }

    function resetMagnet(event) {
      //now the event.currentTarget is the parent, we need to select the newbutton
      const magnetButton = event.currentTarget.querySelector(".magnetic");
      const ButtonHam = magnetButton.querySelector("button.menu-btn");
      const hovercolor = magnetButton.querySelector(".hovercolor");
      
      if (hovercolor != null && magnetButton.querySelector("button.menu-btn.-active") == null){
        hovercolor.style.height = "0%";
        hovercolor.style.top = "0%";
      }

      gsap.to(magnetButton, 1.5, {
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.3)"
      });

      if (ButtonHam != null){
      gsap.to(ButtonHam, 1.5, {
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.3)"
      });
      }
}

}

let isOpen = false;
function initMenu(){
  console.log("inizializzo Menu")

  let hamButtonToggle = document.querySelector(".hamButton button.menu-btn")
  let Menu = document.querySelector("menu");
  let Main = document.querySelector(".mainContent")

  hamButtonToggle.addEventListener("click", () => {
    
    if (isOpen){
      gsap.to(".hamButton", {background:"var(--black)"}) //rende il bg nero
      hamButtonToggle.classList.remove("-active");
      Menu.classList.remove("-active");
      gsap.to(".mainContent", { filter: "blur(0px)" });
      locoScroll.start();
      isOpen = false
    }
    else{
      isOpen = true;
      hamButtonToggle.classList.add("-active");
      Menu.classList.add("-active");
      gsap.to(".mainContent", { filter: "blur(3px",duration: 0.3 });
      locoScroll.stop();
      
    }
  });

}

function enterAnim(){
  gsap.to(".loading-screen", {
    delay:0.3,
    duration: 0.3,  // Durata dell'animazione in secondi
    opacity: 0,   // Imposta l'opacità a 0
    onComplete: function() {
      document.querySelector(".loading-screen").style.display = "none";
    }
  });
}

function initBarba(){
  console.log("inizializzo Barba")


  barba.hooks.after(() => {    
    scroll.init();
    scroll.stop();
  });

  barba.init({
    sync: true,
    debug: false,
    timeout:5000,
    transitions: [{
      name: 'default-transition',
      once(data) {
        initSmoothScroll(data.next.container);
      },
      leave(data) {


        
        let isOpen2 = false
        if (document.querySelector("button.menu-btn.-active") != null){
          gsap.to("ham.OutRange",{scale:0, duration:.3, ease: "power4.out",rotate: "0.001deg"})

          isOpen = false
          document.querySelector(".menu-toggle button.menu-btn").classList.remove("-active");
          document.querySelector(".hamButton button.menu-btn").classList.remove("-active")
          isOpen2 = true          
          gsap.to(".hamButton", {background:"var(--black)", delay: .5})
          document.querySelector("menu").classList.remove("-active");
          gsap.to(".hamButton .hovercolor", {height:0, top:0, delay: .5})

        }

          if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
              delay: .2,
              top: 0,
              behavior: 'smooth' // Abilita lo smooth scrolling
            });
          } else {
            // Se il browser non supporta lo scrolling smooth, utilizza un fallback
            window.scrollTo(0, 0);
          }
          document.querySelector(".loading-screen").style.display = 'block';
        return gsap.to(".loading-screen", {
          delay: isOpen2? .5:0 ,
          duration: 0.3,
          opacity: 1,
          onComplete: () => {
            data.current.container.remove();
            isOpen2 = false
          }
        }); 
      },
      async beforeEnter(data) {
        console.log("beforeEnter");

        magnets.forEach((magnet) => {
          const OuterMagneticRange = magnet.closest(".OutRange");
          OuterMagneticRange.removeEventListener("mousemove", moveMagnet);
          OuterMagneticRange.removeEventListener("mouseleave", resetMagnet);
        });
        ScrollTrigger.getAll().forEach(t => t.kill());
        locoScroll.destroy();
        initSmoothScroll(data.next.container);
        
      },
    }]
  })




  function  initSmoothScroll(container){ //devo fare il setup del container
    locoScroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true
    });

    
    window.onresize = locoScroll.update();

    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
      scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
      }, // we don't have to define a scrollLeft because we're only scrolling vertically.
      getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
      },
      // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
      pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.defaults({
      scroller: document.querySelector('[data-scroll-container]'),
    });


    let scrollHide = document.createElement("style");
    scrollHide.innerHTML = `body::-webkit-scrollbar {display: none;}`;
    document.head.appendChild(scrollHide);

    /* ------------------ Dichiaro solo ora gli scroll trigger ------------------ */

    fireScript()

    /* --------------------------- Fine dichiarazione --------------------------- */

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
  }
}

function initCursor(){
  const cursor = new MouseFollower({
    speed: 0.3,
    skewing: 1
});
}


function initHamAppear(){
  ScrollTrigger.create({
    scroller: "[data-scroll-container]",
    trigger: ".HamTrigger",
    scrub: true,
    start: "0 70%",
    //markers: true,
    onEnter: () => gsap.to("ham.OutRange",{scale:1, duration:.3, ease:"power4.out",rotate: "0.001deg" }),
    onLeaveBack: () => gsap.to("ham.OutRange",{scale:0, duration:.3, ease: "power4.out",rotate: "0.001deg"})
  });
}


function fireScript(){
  initHamAppear()
  initMagneticButtons();
  initCursor();
  initMenu(); 
}

function preloader(){
    let counterPercent = document.querySelector(".counterPercent");
    let currentValue=0;

    function updateCounter(){
      if (currentValue === 100){ 
        enterAnim();
        return
      }

      currentValue += Math.floor(Math.random()*10) + 1;

      if (currentValue > 100){
        currentValue = 100;
      }

      counterPercent.textContent = currentValue;
      const loadingMask = document.querySelector(".thumb");
      loadingMask.style.width = 100 - currentValue + "%";

      let delay = Math.floor(Math.random() * 200) + 50;
      setTimeout(updateCounter,delay)
    }
    updateCounter();
} 

document.addEventListener("DOMContentLoaded", function () {
  initBarba();
  preloader();
});


  