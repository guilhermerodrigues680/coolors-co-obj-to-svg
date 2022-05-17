<template>
  <div class="home">
    <button @click="colorJson = colorJsonPlaceholder">Carregar demo</button>
    <label>
      Objeto de cores:
      <textarea
        :placeholder="'Exemplo de um objeto de cores:\n' + colorJsonPlaceholder"
        class="textarea-color-json"
        :class="{ 'textarea-color-json--invalid': !colorJsonValid }"
        v-model="colorJson"
        spellcheck="false"
      ></textarea>
    </label>

    <input type="range" v-model.number="colorsPerRow" min="1" max="10" />

    <textarea ref="textareaSvg" :value="colorPaleteSvg" readonly></textarea>

    <button ref="btnCopyToClipboard">Copiar para área de transferência</button>
    <button @click="handleDownloadSvg()">Baixar SVG</button>
    <div v-html="colorPaleteSvg"></div>

    <!-- TODO: Selecionar formato da imagem, qualidade e mostrar tamanho final -->
    <canvas ref="canvas"></canvas>
    <button @click="handleDownloadCanvasImg">Baixa Imagem</button>
    <button @click="handleOpenCanvasImg">Ver Imagem</button>

    <button @click="handleOpenPdf">Ver PDF</button>
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
import Swal from "sweetalert2";
import { convObjToSvg2 } from "@/modules/obj-to-svg-palette/helpers/obj-to-svg-palette";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// https://stackoverflow.com/questions/46856550/pdfmake-roboto-regular-ttf-not-found-in-virtual-file-system-only-after-gulp
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const exampleJson = `{
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
}`;

export default {
  name: "HomeView",
  components: {},

  data: () => ({
    colorJsonPlaceholder: exampleJson,
    colorJson: "",
    colorPaleteSvg: "",
    /** @type {Canvg} */
    canvgInstance: null,
    colorsPerRow: 3,
    pdfDocDefinition: Object.freeze({ docDefinition: null }),
  }),

  computed: {
    colorJsonValid() {
      try {
        JSON.parse(this.colorJson);
        return true;
      } catch (error) {
        return false;
      }
    },
  },

  watch: {
    colorJson() {
      this.colorJsonToSvg();
    },

    colorsPerRow() {
      this.colorJsonToSvg();
    },
  },

  mounted() {
    const clipboardSvg = new ClipboardJS(this.$refs.btnCopyToClipboard, {
      target: (/*trigger*/) => this.$refs.textareaSvg,
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

    // this.$once("hook:beforeDestroy", () => {});
  },

  beforeDestroy() {
    this.canvgInstance?.stop();
  },

  methods: {
    colorJsonToSvg() {
      if (!this.colorJsonValid) {
        return;
      }

      const svgEl = convObjToSvg2(this.colorJson, this.colorsPerRow);
      this.colorPaleteSvg = svgEl.outerHTML;
      // --- Redimensiona Imagem
      // const svgDimensions = {
      //   width: +svgEl.getAttribute("width"),
      //   height: +svgEl.getAttribute("height"),
      // };
      // svgEl.setAttribute("width", svgDimensions.width * 4);
      // svgEl.setAttribute("height", svgDimensions.height * 4);
      // --- FIM Redimensiona Imagem

      // --- BG
      // --- FIM BG

      // chart_svg = chart_svg.replace('width="600"', 'width="1280"');
      // chart_svg = chart_svg.replace('height="400"', 'height="860"');
      // var dWidth = 1280/600, dHeight = 860/400;
      // chart_svg = chart_svg.replace('<svg ', '<svg transform="scale(' + dWidth + ' ' + dHeight + ')" ');

      /** @type {{canvas: HTMLCanvasElement}} */
      const { canvas } = this.$refs;
      // canvas.width = svgDimensions.width * 4;
      // canvas.height = svgDimensions.height * 4;
      // console.debug(canvas.width, canvas.height, svgDimensions.width, svgDimensions.height);
      const ctx = canvas.getContext("2d");

      this.canvgInstance?.stop();
      // const canvgInstance = Canvg.fromString(ctx, this.colorPaleteSvg, {
      const canvgInstance = Canvg.fromString(ctx, svgEl.outerHTML, {
        // ignoreDimensions: true,
        // scaleWidth: 200,
        // scaleHeight: 200,
        ignoreMouse: true,
      });
      canvgInstance.start(); // Start SVG rendering with animations and mouse handling.

      // https://stackoverflow.com/questions/36522927/how-to-get-background-color-of-svg-converted-properly-into-canvas
      ctx.globalCompositeOperation = "destination-over";
      // ctx.fillStyle = "#FF00FF";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // PDF
      const docDefinition = {
        info: {
          title: "Color Palette",
          author: "colors to color palette",
          subject: "color palette",
          creator: "colors-to-color-palette WebApp",
        },
        pageSize: {
          width: canvas.width,
          height: "auto",
        },
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [0, 0, 0, 0],
        content: [
          "SVG nodes behave similar to images by supporting width/height or fit",
          "It is however not yet possible to use svg files or to have a library of svgs in the document definition",
          "\n",
          "Note that before you can use SVG nodes you must install svg-to-pdfkit as it is not included with pdfmake to keep bundle size down",
          "You can also fit the svg inside a rectangle",
          {
            svg: svgEl.outerHTML,
            // fit: [100, 100],
          },
        ],
      };

      // Object.freeze no objeto superior, o interno não foi congelado
      // é importante para o vue não ficar monitorando o objeto
      this.pdfDocDefinition = Object.freeze({ docDefinition });
    },

    handleDownloadSvg() {
      const filename = "color-pallete.svg";
      const blob = new Blob([this.colorPaleteSvg], { type: "image/svg+xml" });
      saveAs(blob, filename);
      Swal.fire({
        icon: "success",
        title: "Download iniciado!",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    handleDownloadCanvasImg() {
      /** @type {{canvas: HTMLCanvasElement}} */
      const { canvas } = this.$refs;
      canvas.toBlob((blob) => {
        const filename = "color-pallete.png";
        saveAs(blob, filename);
      }); // image/png, image/jpg (0 a 1)
    },

    handleOpenCanvasImg() {
      /** @type {{canvas: HTMLCanvasElement}} */
      const { canvas } = this.$refs;
      canvas.toBlob((blob) => {
        window.open(URL.createObjectURL(blob), "_blank");
      }); // image/png, image/jpg (0 a 1)
    },

    handleOpenPdf() {
      const pdfDoc = pdfMake.createPdf(this.pdfDocDefinition.docDefinition);
      pdfDoc.getBlob((blob) => window.open(URL.createObjectURL(blob), "_blank"));
    },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  white-space: pre;
  font-size: 12px;
}

.textarea-color-json {
  &--invalid {
    border-color: red;
  }
}
</style>
