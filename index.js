/*
  Object Example:
  {
    "Old Mauve": "6a294d",
    "Pink Pantone": "cf5597",
    "Myrtle Green": "337b77",
    "Dodger Blue": "4297fa",
    "Cyber Yellow": "fdce02",
    "Rich Black FOGRA 29": "091221",
    "Black": "000000",
    "Gray Web": "808080",
    "Cultured": "f1f1f1",
    "White": "ffffff"
  }
*/

/** @type {HTMLTextAreaElement} */
const textareaObjEl = document.querySelector("#textarea-obj");
/** @type {HTMLTextAreaElement} */
const textareaSvgEl = document.querySelector("#textarea-svg");
/** @type {HTMLDivElement} */
const previewOutputSvgEl = document.querySelector("#preview-output-svg");
/** @type {HTMLButtonElement} */
const btnDownloadSvgEl = document.querySelector("#btn-download-svg");

// TODO Gerar url
// https://coolors.co/6a294d-cf5597-337b77-4297fa-fdce02-091221-000000-808080-f1f1f1-ffffff

function convObjToSvg(objStr) {
  const coolorscoObj = JSON.parse(objStr);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.appendChild(document.createComment("Tranformado por ????"));

  const rectWH = {
    width: 50,
    height: 220,
  };

  let colorCount = 0;
  for (const colorName in coolorscoObj) {
    if (Object.hasOwnProperty.call(coolorscoObj, colorName)) {
      const colorHex = "#" + coolorscoObj[colorName];

      // ex: <rect fill="#6a294d" x="0" y="0" width="50" height="220" />
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("fill", colorHex);
      rect.setAttribute("x", colorCount * rectWH.width);
      rect.setAttribute("y", 0);
      rect.setAttribute("width", rectWH.width);
      rect.setAttribute("height", rectWH.height);
      svg.appendChild(rect);
      colorCount++;
    }
  }

  const svgWidth = colorCount * rectWH.width;
  const svgHeight = 250;

  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

  // <!-- Exported from Coolors.co - https://coolors.co/6a294d-cf5597-337b77-4297fa-fdce02-091221-000000-808080-f1f1f1-ffffff -->

  //<text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
  //<text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/6a294d-cf5597-337b77-4297fa-fdce02-091221-000000-808080-f1f1f1-ffffff</text>

  // Imprime na tela
  console.debug("svg", svg.outerHTML);
  document.body.appendChild(svg);
}

function convObjToSvg2(objStr) {
  const coolorscoObj = JSON.parse(objStr);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.appendChild(document.createComment("Tranformado por ????"));

  const circleRadius = 30;
  const circleDiameter = circleRadius * 2;
  let colorCount = 0;
  const currentCoords = {
    currentX: 0,
    currentY: 0,
  };
  const circlesPerRow = 3;
  const margin = {
    x: 48,
    y: 16,
  };
  const marginTop = 8;
  const fontSizeTexts = 14;
  const marginTop1 = 4;
  for (const colorName in coolorscoObj) {
    if (Object.hasOwnProperty.call(coolorscoObj, colorName)) {
      const colorHex = "#" + coolorscoObj[colorName];

      if (colorCount != 0) {
        currentCoords.currentX += circleDiameter + margin.x;
      }

      if (colorCount != 0 && colorCount % circlesPerRow === 0) {
        // volta o x
        currentCoords.currentX = 0;
        // o y deve ser acrecentado a
        // altura do circulo + altura dos textos
        currentCoords.currentY += circleDiameter + margin.y + marginTop + fontSizeTexts + marginTop1 + fontSizeTexts;
      }

      // ex: <circle cx="28.5" cy="28.5" r="28.5" fill="#C4C4C4" />
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("fill", colorHex);
      circle.setAttribute("cx", currentCoords.currentX + circleRadius);
      circle.setAttribute("cy", currentCoords.currentY + circleRadius);
      circle.setAttribute("r", circleRadius);

      // <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">str</text>
      const textColorName = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const textColorHex = document.createElementNS("http://www.w3.org/2000/svg", "text");

      textColorName.setAttribute("x", currentCoords.currentX);
      textColorName.setAttribute("y", currentCoords.currentY + circleDiameter + marginTop);
      textColorName.setAttribute("font-family", "Arial");
      textColorName.setAttribute("font-size", fontSizeTexts);
      textColorName.setAttribute("alignment-baseline", "hanging");
      textColorName.setAttribute("fill", "#000000");

      textColorHex.setAttribute("x", currentCoords.currentX);
      textColorHex.setAttribute("y", currentCoords.currentY + circleDiameter + marginTop + fontSizeTexts + marginTop1);
      textColorHex.setAttribute("font-family", "monospace");
      textColorHex.setAttribute("font-size", fontSizeTexts);
      textColorHex.setAttribute("alignment-baseline", "hanging");
      textColorHex.setAttribute("fill", "#586782");

      textColorName.innerHTML = colorName;
      textColorHex.innerHTML = `HEX: ${colorHex}`;

      svg.appendChild(circle);
      svg.appendChild(textColorName);
      svg.appendChild(textColorHex);
      colorCount++;
    }
  }

  const svgWidth = circlesPerRow * circleDiameter * margin.x;
  const svgHeight = currentCoords.currentY + circleDiameter + marginTop + fontSizeTexts + marginTop1 + fontSizeTexts;

  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

  // <!-- Exported from Coolors.co - https://coolors.co/6a294d-cf5597-337b77-4297fa-fdce02-091221-000000-808080-f1f1f1-ffffff -->

  //<text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
  //<text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/6a294d-cf5597-337b77-4297fa-fdce02-091221-000000-808080-f1f1f1-ffffff</text>

  // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
  previewOutputSvgEl.textContent = "";
  previewOutputSvgEl.appendChild(svg);
  textareaSvgEl.value = svg.outerHTML;
}

const clipboardSvg = new ClipboardJS("#btn-copy-to-clipboard", {
  target: (/*trigger*/) => textareaSvgEl,
});

clipboardSvg.on("success", (e) => {
  Swal.fire({
    icon: "success",
    title: "SVG Copiado!",
    showConfirmButton: false,
    timer: 1500,
  });
  e.clearSelection();
});

clipboardSvg.on("error", (e) => {
  Swal.fire({
    icon: "error",
    title: "Erro ao copiar svg",
  });
  console.error("clipboardSvg error: ", e);
});

textareaObjEl.addEventListener("change", () => {
  convObjToSvg2(textareaObjEl.value);
});

textareaObjEl.addEventListener("paste", (event) => {
  const paste = (event.clipboardData || window.clipboardData).getData("text");
  convObjToSvg2(paste);
});

btnDownloadSvgEl.addEventListener("click", () => {
  // const docInfo = '<?xml version="1.0" encoding="utf-8"?>\n';
  // const blob = new Blob([docInfo + textareaSvgEl.value], { type: "image/svg+xml" });
  const blob = new Blob([textareaSvgEl.value], { type: "image/svg+xml" });
  saveAs(blob, "color-pallete.svg");
  Swal.fire({
    icon: "success",
    title: "Download iniciado!",
    showConfirmButton: false,
    timer: 1500,
  });
});

// debug
convObjToSvg2(`{
  "Old Mauve": "6a294d",
  "Pink Pantone": "cf5597",
  "Myrtle Green": "337b77",
  "Dodger Blue": "4297fa",
  "Cyber Yellow": "fdce02",
  "Rich Black FOGRA 29": "091221",
  "Black": "000000",
  "Gray Web": "808080",
  "Cultured": "f1f1f1",
  "White": "ffffff"
}`);
