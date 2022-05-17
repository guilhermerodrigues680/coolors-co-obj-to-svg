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
    <textarea ref="textareaSvg" :value="colorPaleteSvg" readonly></textarea>
    <button ref="btnCopyToClipboard">Copiar para área de transferência</button>
    <button @click="handleDownloadSvg()">Baixar SVG</button>
    <div v-html="colorPaleteSvg"></div>
    <canvas ref="canvas"></canvas>
    <button @click="handleDownloadCanvasImg">Baixa Imagem</button>
    <button @click="handleOpenCanvasImg">Ver Imagem</button>
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
import Swal from "sweetalert2";
import { convObjToSvg2 } from "@/modules/obj-to-svg-palette/helpers/obj-to-svg-palette";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";

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
      if (this.colorJsonValid) {
        this.colorJsonToSvg(this.colorJson);
      }
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
    colorJsonToSvg(json) {
      const svgEl = convObjToSvg2(json);
      this.colorPaleteSvg = svgEl.outerHTML;
      const svgDimensions = {
        width: +svgEl.getAttribute("width"),
        height: +svgEl.getAttribute("height"),
      };
      svgEl.setAttribute("width", svgDimensions.width * 4);
      svgEl.setAttribute("height", svgDimensions.height * 4);

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
      });
      canvgInstance.start(); // Start SVG rendering with animations and mouse handling.
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
