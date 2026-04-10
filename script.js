


document.addEventListener("DOMContentLoaded", function() {
	let expression = "";
	let justEvaluated = false;
	const screen = document.getElementById("screen");

	function updateScreen(val) {
		screen.textContent = (!val) ? "0" : val;
	}

	function isOperator(char) {
		return ["+", "-", "*", "/"].includes(char);
	}

	function handleNum(num) {
		if (justEvaluated) {
			expression = num;
			justEvaluated = false;
		} else {
			expression += num;
		}
		updateScreen(expression);
	}

	function handleOperator(op) {
		if (expression === "") return;
		if (isOperator(expression[expression.length - 1])) {
			// Replace last operator
			expression = expression.slice(0, -1) + op;
		} else {
			expression += op;
		}
		justEvaluated = false;
		updateScreen(expression);
	}

	function handleEquals() {
		if (expression === "") return;
		// Prevent trailing operator
		let exp = expression;
		if (isOperator(exp[exp.length - 1])) {
			exp = exp.slice(0, -1);
		}
		let result = evaluateExpression(exp);
		updateScreen(result);
		expression = result.toString();
		justEvaluated = true;
	}

	function handleClear() {
		expression = "";
		updateScreen("0");
		justEvaluated = false;
	}

	function handleBack() {
		if (expression.length > 0) {
			expression = expression.slice(0, -1);
			updateScreen(expression || "0");
		}
	}

	function evaluateExpression(exp) {
		let tokens = [];
		let num = "";
		for (let i = 0; i < exp.length; i++) {
			let c = exp[i];
			if (isOperator(c)) {
				if (num === "" && c === "-") {
					num = "-"; // negative number
				} else {
					if (num !== "") tokens.push(Number(num));
					tokens.push(c);
					num = "";
				}
			} else {
				num += c;
			}
		}
		if (num !== "") tokens.push(Number(num));

		// Operator precedence: */ then +-
		let i = 0;
		while (i < tokens.length) {
			if (tokens[i] === "*" || tokens[i] === "/") {
				let a = tokens[i - 1];
				let b = tokens[i + 1];
				let res = tokens[i] === "*" ? a * b : (b === 0 ? "Err" : a / b);
				tokens.splice(i - 1, 3, res);
				i = 0;
			} else {
				i++;
			}
		}
		i = 0;
		while (i < tokens.length) {
			if (tokens[i] === "+" || tokens[i] === "-") {
				let a = tokens[i - 1];
				let b = tokens[i + 1];
				let res = tokens[i] === "+" ? a + b : a - b;
				tokens.splice(i - 1, 3, res);
				i = 0;
			} else {
				i++;
			}
		}
		return tokens[0] === undefined ? 0 : tokens[0];
	}

	document.querySelector(".calculator-buttons").addEventListener("click", function(e) {
		const btn = e.target.closest('.btn');
		if (!btn) return;
		if (btn.hasAttribute("data-num")) {
			handleNum(btn.getAttribute("data-num"));
		} else if (btn.dataset.action === "add") {
			handleOperator("+");
		} else if (btn.dataset.action === "subtract") {
			handleOperator("-");
		} else if (btn.dataset.action === "multiply") {
			handleOperator("*");
		} else if (btn.dataset.action === "divide") {
			handleOperator("/");
		} else if (btn.dataset.action === "equals") {
			handleEquals();
		} else if (btn.dataset.action === "clear") {
			handleClear();
		} else if (btn.dataset.action === "back") {
			handleBack();
		}
	});

	updateScreen("0");
});
