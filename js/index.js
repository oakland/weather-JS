// ---- tab start ----
const tab = document.querySelector(".tab"); // 提出一个问题，如果 html 中有多个 .tabs 的标签怎么办？
const tabs = tab.querySelectorAll("li");
const weatherControls = document.querySelectorAll(".weather-control div.control-content");

tab.addEventListener("click", function(e) {
	const targetNode = e.target;
	const dataId = targetNode.getAttribute("data-id");

	for (let i = 0, len = tabs.length; i < len; i++) {
		tabs[i].classList.remove("active");
		weatherControls[i].classList.remove("show");
	}

	targetNode.classList.add("active");
	weatherControls[dataId].classList.add("show");
});
// ---- tab end ----

function addToggleToBtn(el, startFn, stopFn) {
	const text = el.innerHTML;

	el.addEventListener("click", startFn, false);
	el.addEventListener("click", toggleFn, false);

	function toggleFn() {
		const isFn = this.innerHTML == text;

		this.removeEventListener("click", toggleFn, false);
		if(isFn) {
			this.removeEventListener("click", startFn, false);
			this.addEventListener("click", stopFn, false);
		} else {
			this.removeEventListener("click", stopFn, false);
			this.addEventListener("click", startFn, false);
		}
		this.addEventListener("click", toggleFn, false);

		this.innerHTML = isFn ? "stop" : text;
	}
}

// ---- rain start ----
const rainBtn = document.querySelector("#rain");
addToggleToBtn(rainBtn, rain, stopRain);
// ---- rain end ----

// ---- flash start ----
const flashBtn = document.querySelector("#flash");
addToggleToBtn(flashBtn, flash, stopFlash);
// ---- flash end ----

// ---- snow start ----
const snowBtn = document.querySelector("#snow");
addToggleToBtn(snowBtn, snow, stopSnow);
// ---- snow end ----

// ---- frost start ----
const frostBtn = document.querySelector("#frost");
addToggleToBtn(frostBtn, frost, stopFrost);
// ---- frost end ----