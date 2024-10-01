export interface IBreakpoint {
	maxWidth: number;
	columnCount: number;
}

export interface IMasonryparams {
	breakpoints: Array<IBreakpoint>;
	itemSelector: string;
	columnCount: number;
	containerSelector: string;
}

class TinyMasonry {
	container: HTMLElement | null;
	items: Array<HTMLElement>;
	columnCount: number;
	defaultColumnCount: number;
	breakPoints: Array<IBreakpoint>;
	updateEvent: () => void;

	constructor(params: IMasonryparams) {
		this.items = [];
		this.breakPoints = params.breakpoints;
		this.columnCount = this.defaultColumnCount = params.columnCount;
		this.container = document.querySelector(params.containerSelector);
		if (this.container == null) return;
		this.container.style.display = "flex";

		this.container.querySelectorAll(params.itemSelector).forEach((el) => {
			this.items.push(el as HTMLElement);
		});
		this.updateBreakpoints();

		this.updateEvent = this.updateBreakpoints.bind(this);

		window.addEventListener("resize", this.updateEvent, true);
	}

	render() {
		if (!this.container) return;
		this.container.innerHTML = "";

		for (let i = 0; i < this.columnCount; i++) {
			let columnElement = document.createElement("div");
			columnElement.className = "m-column";
			columnElement.style.width = `calc(${100 / this.columnCount}%)`;
			let appendFunc = (index: number) => {
				if (this.items[index]) {
					let el = this.items[index];
					columnElement.appendChild(el);
					appendFunc(index + this.columnCount);
				}
			};
			appendFunc(i);
			this.container.appendChild(columnElement);
		}
	}

	updateBreakpoints() {
		this.columnCount = this.defaultColumnCount;
		if (this.breakPoints) {
			this.breakPoints.forEach((point: IBreakpoint) => {
				if (window.innerWidth < point.maxWidth) {
					this.columnCount = point.columnCount;
				}
			});
		}

		this.render();
	}

	destroy() {
		window.removeEventListener("resize", this.updateEvent, true);
		if (!this.container) return;
		this.container.innerHTML = "";
		this.container.style.display = "block";
		this.items.forEach((item: HTMLElement) => {
			if (this.container) {
				this.container.appendChild(item);
			}
		});
	}
}

export default TinyMasonry;
