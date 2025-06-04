/**
 * [contextual.js]{@link https://github.com/ia74/contextual}
 * @author ia74
 * @version 1.1.0
 */

/**
 * 
 * Idea: Harbor and display HTML views. We will need to add extra tags.
 */

/**
 * [contextual.js]{@link https://github.com/ia74/contextual}
 * @author ia74
 * @version 1.1.p0
 */
const ctxl = {
	view_container: "#ctxl-view-cont",
	as: "html",
	version: "1.0.0",
	loadingHTML: "Loading a view...",
	views: [],
	addView: (view) => {
		if (!ctxl.views.includes(view)) ctxl.views.push(view);
	},
	generateView: (view) => {
		if (!ctxl.views.includes(view)) {
			console.log(`View ${view} not found.`);
			const ele = document.createElement("p");
			ele.innerText = `View ${view} not found.`;
			return ele;
		}
		if(document.querySelectorAll(`script[ctxl-id="${view}"]`).length > 0) {
      for(const script of document.querySelectorAll(`script[ctxl-id="${view}"]`)) {
				script.remove();
			}
    }
		const view_html = document.createElement(ctxl.as);
		view_html.setAttribute("ctxl-id", view);
		view_html.innerHTML = ctxl.loadingHTML;
		fetch(`./views/${view}.${ctxl.as}`)
			.then((response) => response.text())
			.then((data) => {
				view_html.innerHTML = data;
			})
			.then(async () => {
				await ctxl.processViewScripts(view_html, view)
			});
		return view_html;
	},
	processViewScripts: async (view_html, view)=> {
		const scripts = view_html.getElementsByTagName("script");
	
		for (let i = 0; i < scripts.length; i++) {
			const original = scripts[i];
			const handleAsCjs = original.hasAttribute("ctxl-cjs");
			const handleAsExternalImport = original.hasAttribute("ctxl-import");
			const block = original.hasAttribute("ctxl-block");
	
			const script = document.createElement("script");
			script.type = handleAsCjs ? "" : "module";
			script.classList.add("ctxl-view-script");
			script.setAttribute("ctxl-id", view);
	
			if (handleAsExternalImport) {
				script.src = original.src;
			} else {
				script.text = original.text;
			}
	
			if (block) {
				await new Promise((resolve, reject) => {
					script.onload = resolve;
					script.onerror = reject;
					document.body.appendChild(script);
				});
			} else {
				document.body.appendChild(script);
			}
		}
	},	
	opened: [],
	createViewContainer: () => {
		const view_container = document.createElement("div");
		view_container.id = ctxl.view_container.split("#")[1];
		return view_container;
	},
	nonDestructiveView: (view) => {
		if (!document.querySelector(ctxl.view_container))
			document.body.appendChild(ctxl.createViewContainer());
		if (document.querySelector(`${ctxl.as}[ctxl-id="${view}`))
			document
				.querySelector(ctxl.view_container)
				.replaceChild(
					document.querySelector(`${ctxl.as}[ctxl-id="${view}"]`),
					ctxl.generateView(view),
				);
		else
			document
				.querySelector(ctxl.view_container)
				.appendChild(ctxl.generateView(view));
		ctxl.opened.push(view);
	},
	reloadView: (view) => {
		if (!document.querySelector(ctxl.view_container))
			document.body.appendChild(ctxl.createViewContainer());
		if (ctxl.onclose[view]) ctxl.onclose[view]();
		if (ctxl.onclose[view]) delete ctxl.onclose[view];
		const scripts = document.querySelectorAll(`.ctxv${view}`);
		for (let i = 0; i < scripts.length; i++) {
			scripts[i].remove();
		}
		document
			.querySelector(ctxl.view_container)
			.replaceChild(
				ctxl.generateView(view),
				document.querySelector(`${ctxl.as}[ctxl-id="${view}"]`),
			);
	},
	destructiveView: (view) => {
		if (!document.querySelector(ctxl.view_container))
			document.body.appendChild(ctxl.createViewContainer());
		document.querySelector(ctxl.view_container).innerHTML = "";
		document
			.querySelector(ctxl.view_container)
			.appendChild(ctxl.generateView(view));
		ctxl.opened = [view];
	},
	waitForClose: async (view) =>
		new Promise((resolve, reject) => {
			const interval = setInterval(() => {
				if (
					!document.querySelector(`${ctxl.as}[ctxl-id="${view}"]`) &&
					!ctxl.opened.includes(view)
				) {
					clearInterval(interval);
					resolve();
				}
			}, 100);
		}),
	onclose: {},
	closeView: (view) => {
		if (ctxl.onclose[view]) ctxl.onclose[view]();
		document.querySelector(`${ctxl.as}[ctxl-id="${view}"]`).remove();
		ctxl.opened = ctxl.opened.filter((v) => v !== view);
	},
};

export default ctxl;