"use strict";

// Make navbar transparent when it is on the top
// 상단 메뉴 생성
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add("navbar--dark");
  } else {
    navbar.classList.remove("navbar--dark");
  }
});

// Handle scrolling when tapping on the navbar menu
// 상단 메뉴 선택 시 자동 스크롤
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) return;
  navbarMenu.classList.remove("open");
  scrollIntoView(link);
});

// Navbar toggle button for small screen
// 화면 작아질 시 토글버튼 생성
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", (event) => {
  navbarMenu.classList.toggle("open");
});

// Handle scrolling when tapping on the contact button of home
// Home 섹션 Contact 버튼 클릭 시 Contact 섹션으로 이동
const contactBtn = document.querySelector(".home__contact");
contactBtn.addEventListener("click", () => {
  scrollIntoView("#contact");
});

// Make home slowly fade to transparent as the window scrolls down
// 스크롤 내릴 시 Home 섹션 흐려지기
const home = document.querySelector(".home__container");
const homeheight = home.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  home.style.opacity = 1 - window.scrollY / homeheight;
});

// Make arrow to move the top
// 상단 바로가기 버튼
const arrow = document.querySelector("#arrowBtn");
document.addEventListener("scroll", () => {
  if (window.scrollY > navbarHeight) {
    arrow.style.display = "block";
  } else arrow.style.display = "none";
});
arrow.addEventListener("click", (event) => {
  scrollIntoView("#home");
});

// Work filter
// 프로젝트 필터
const workBtnContainer = document.querySelector(".work__categories");
const projectContainer = document.querySelector(".work__projects");
const projects = document.querySelectorAll(".project");
workBtnContainer.addEventListener("click", (event) => {
  const filter =
    event.target.dataset.filter || event.target.parentNode.dataset.filter;
  if (filter == null) return;

  const active = document.querySelector(".category__btn.selected");
  active.classList.remove("selected");
  const target =
    event.target.nodeName === "BUTTON" ? event.target : event.target.parentNode;
  target.classList.add("selected");

  projectContainer.classList.add("anim-out");

  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === "*" || filter === project.dataset.type) {
        project.classList.remove("invisible");
      } else project.classList.add("invisible");
    });
    projectContainer.classList.remove("anim-out");
  }, 300);
});

// 인터섹션 옵저버로 모든 섹션들의 진입과 나가는 것을 관찰
// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다
// 2. 인터섹션 옵저버를 이용하여 모든 섹션들을 관찰한다
// 3. 두번째를 이용해서 관찰된 우리가 보여지는 섹션의 해당하는 메뉴 아이템을 활성화시킨다

// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다
const sectionIds = [
  "#home",
  "#about",
  "#skill",
  "#work",
  "#testimonials",
  "#contact",
];

const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove("active");
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

// 2. 인터섹션 옵저버를 이용하여 모든 섹션들을 관찰한다
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        // 스크롤이 위로 되어서 페이지가 내려옴
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

window.addEventListener("wheel", () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(
      window.scrollY + window.innerHeight >= document.body.clientHeight
    )
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});
