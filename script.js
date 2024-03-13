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
  let fpButtonsToggle = document.querySelector(".menu-toggle button.menu-btn");
  let Menu = document.querySelector("menu");
  let Main = document.querySelector(".mainContent")

  hamButtonToggle.addEventListener("click", () => {
    Menu.classList.toggle("-active");
    Main.classList.toggle("-inverted");
    
    if (isOpen){
      gsap.to(".hamButton", {background:"var(--black)"})
      gsap.to("ham.OutRange",{scale:0, duration:.3, ease: "power4.out",rotate: "0.001deg"})
      fpButtonsToggle.classList.toggle("-active");
      
      isOpen = false
    }
    else{
      hamButtonToggle.classList.toggle("-active");
    }
  });

  fpButtonsToggle.addEventListener("click", () => {
    fpButtonsToggle.classList.toggle("-active");
    Menu.classList.toggle("-active");
    Main.classList.toggle("-inverted");

    if (!isOpen){
      isOpen = true
      gsap.to("ham.OutRange",{scale:1, delay:.2, duration:.3, ease:"power4.out",rotate: "0.001deg" })
      gsap.to(".hamButton", {background:"var(--accent)"})
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
        return gsap.to(".loading-screen", {
          delay: 1,
          y: "-100%"
        });
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
          document.querySelector("menu").classList.toggle("-active");
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
        return gsap.to(".loading-screen", {
          delay: isOpen2? .5:0 ,
          y: 0,
          onComplete: () => {
            data.current.container.remove();
            isOpen2 = false
            
          }
        }); 
      },
      enter(data) {
        return gsap.to(".loading-screen", {
          delay: 1,
          y: "-100%"
        });
      },
      async beforeEnter(data) {
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

function initScrollingPhrase(){  
    let direction = 1; // 1 = forward, -1 = backward scroll
  
    const roll1 = roll(".rollingText ", {duration: 18}),
          scroll = ScrollTrigger.create({
            trigger: document.querySelector('[data-scroll-container]'),
            onUpdate(self) {
              if (self.direction !== direction) {
                direction *= -1;
                gsap.to(roll1, {timeScale: direction, overwrite: true});
              }
            }
          });
  
    // helper function that clones the targets, places them next to the original, then animates the xPercent in a loop to make it appear to roll across the screen in a seamless loop.
    function roll(targets, vars, reverse) {
      vars = vars || {};
      vars.ease || (vars.ease = "none");
      const tl = gsap.timeline({
              repeat: -1,
              onReverseComplete() { 
                this.totalTime(this.rawTime() + this.duration() * 10); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
              }
            }), 
            elements = gsap.utils.toArray(targets),
            clones = elements.map(el => {
              let clone = el.cloneNode(true);
              el.parentNode.appendChild(clone);
              return clone;
            }),
            positionClones = () => elements.forEach((el, i) => gsap.set(clones[i], {position: "absolute", overwrite: false, top: el.offsetTop, left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth)}));
      positionClones();
      elements.forEach((el, i) => tl.to([el, clones[i]], {xPercent: reverse ? 100 : -100, ...vars}, 0));
      window.addEventListener("resize", () => {
        let time = tl.totalTime(); // record the current time
        tl.totalTime(0); // rewind and clear out the timeline
        positionClones(); // reposition
        tl.totalTime(time); // jump back to the proper time
      });
      return tl;
    }
    
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
  initScrollingPhrase()
  initMagneticButtons();
  initCursor();
  initMenu(); 
}


document.addEventListener("DOMContentLoaded", function () {
  initBarba();
});


  