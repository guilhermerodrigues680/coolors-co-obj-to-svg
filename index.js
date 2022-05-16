const coolorscoObjStr = `{"Old Mauve":"6a294d","Pink Pantone":"cf5597","Myrtle Green":"337b77","Dodger Blue":"4297fa","Cyber Yellow":"fdce02","Rich Black FOGRA 29":"091221","Black":"000000","Gray Web":"808080","Cultured":"f1f1f1","White":"ffffff"}`;

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

convObjToSvg(coolorscoObjStr);
