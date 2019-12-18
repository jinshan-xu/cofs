import printMe from "./print";
import "./assets/styles/index.css";
import { cube } from "./math";

function component() {
  var element = document.createElement("pre");
  var btn = document.createElement("button");

  element.innerHTML = ["Hello webpack", "res is " + cube(5)].join(" ");
  element.classList.add("hello");

  btn.innerHTML = "click me";
  btn.onclick = printMe;

  element.appendChild(btn);

  return element;
}
let element = component();
document.body.appendChild(element);

if (module.hot) {
  module.hot.accept("./print.js", function() {
    console.log("Accepting the updated printMe module!");
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  });
}
