import * as M from "materialize-css";
import Swiper from "swiper";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import TinyMasonry from "./lib/tinyMasonry";

Swiper.use([Navigation, Pagination, Autoplay]);
let dotsSwiper: Swiper;

(() => {
	const sidenav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {
		edge: "right",
	});

	dotsSwiper = new Swiper("#feedback-slider", {
		allowTouchMove: false,
		loop: true,
		speed: 800,
		navigation: {
			nextEl: ".next",
			prevEl: ".prev",
		},
		autoplay: {
			delay: 5000,
		},
		pagination: {
			type: "fraction",
			el: ".current-from",
		},
		on: {
			slideChange: (swiper) => {
				const activeSlide = swiper.slides[swiper.activeIndex];
				const dotId = activeSlide.dataset.slide;

				$(".feedback-dot").removeClass("active");
				$(`[data-slide="${dotId}"]`).addClass("active");
				(<SVGElement>(
					document.querySelector(`#slider-progress`)
				)).style.setProperty(
					"stroke-dashoffset",
					`calc(314.159 * (1 - ${1 - 1}))`
				);
			},
			autoplayTimeLeft: (s: Swiper, time: number, progress: number) => {
				(<SVGElement>(
					document.querySelector(`#slider-progress`)
				)).style.setProperty(
					"stroke-dashoffset",
					`calc(314.159 * (1 - ${1 - progress}))`
				);
			},
		},
	});

	$("body").on("click", ".feedback-dot", switchTab);
	$("body").on("click", ".card-header", toggleCardContent);
	$("body").on("click", ".scroll-link", scrollTo);
	$("body").on("click", ".copy-me", copyMe);

	initMasonry();
	updateFab();
})();

function copyMe(e: JQuery.ClickEvent) {
	e.preventDefault();
	const text = (e.target as HTMLElement).textContent;

	if (typeof navigator.clipboard == "undefined") {
		console.log("navigator.clipboard");
		var textArea = document.createElement("textarea");
		textArea.value = text;
		textArea.style.position = "fixed"; //avoid scrolling to bottom
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand("copy");
			var msg = successful ? "successful" : "unsuccessful";
			M.toast({ html: "Адрес скопирован в буфер обмена!" });
		} catch (err) {
			M.toast({
				html: "Невозможно скопировать в буфер обмена текст: ",
				err,
			});
		}

		document.body.removeChild(textArea);
		return;
	}
	navigator.clipboard.writeText(text).then(
		function () {
			M.toast({ html: "Адрес скопирован в буфер обмена!" });
		},
		function (err) {
			M.toast({
				html: "Невозможно скопировать в буфер обмена текст: ",
				err,
			});
		}
	);
}

function updateFab() {
	const scrollTop = document.documentElement.scrollTop;
	const fab = document.querySelector(".fab");
	if (scrollTop > 300) {
		fab.classList.add("visible");
	} else {
		fab?.classList.remove("visible");
	}
	requestAnimationFrame(updateFab);
}

function scrollTo(e: JQuery.ClickEvent) {
	e.preventDefault();
	const instance = M.Sidenav.getInstance(document.querySelector(".sidenav"));
	instance.close();
	const $target = $(e.target).attr("href");
	const $targetElement = $($target);
	const top = $targetElement.offset().top - 50;
	$("html, body").animate(
		{
			scrollTop: top,
		},
		500
	);
}

function toggleCardContent(e: JQuery.ClickEvent) {
	let el = e.currentTarget;
	let $next = $(el).next();
	$(el).toggleClass("active");
	$next.slideToggle("fast");
}

function switchTab(e: JQuery.ClickEvent) {
	e.preventDefault();
	const slide = parseInt(
		(e.currentTarget as HTMLElement).dataset.slide || ""
	);
	$(".feedback-dot").removeClass("active");
	$(e.currentTarget).addClass("active");
	dotsSwiper.slideTo(slide - 1);
}

function initMasonry() {
	let masonry = new TinyMasonry({
		itemSelector: ".service-card-wrapper",
		containerSelector: ".masonry-wrapper",
		columnCount: 3,
		breakpoints: [
			{
				maxWidth: 1800,
				columnCount: 3,
			},
			{
				maxWidth: 1200,
				columnCount: 2,
			},
			{
				maxWidth: 800,
				columnCount: 1,
			},
		],
	});
}
