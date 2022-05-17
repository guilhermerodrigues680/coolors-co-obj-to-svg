<template>
  <div class="home">
    <label>
      Objeto de cores:
      <textarea
        class="textarea-color-json"
        :class="{ 'textarea-color-json--invalid': !colorJsonValid }"
        v-model="colorJson"
        spellcheck="false"
      ></textarea>
    </label>
    <textarea ref="textareaSvg" :value="colorPaleteSvg" readonly></textarea>
    <button ref="btnCopyToClipboard">Copiar para área de transferência</button>
    <button @click="handleDownloadSvg()">Baixar SVG</button>
    <div v-if="svgEl" v-html="colorPaleteSvg"></div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
import Swal from "sweetalert2";
import { convObjToSvg2 } from "@/modules/obj-to-svg-palette/helpers/obj-to-svg-palette";
import { saveAs } from "file-saver";

export default {
  name: "HomeView",
  components: {},

  data: () => ({
    colorJson: "",
    colorPaleteSvg: "",
    /** @type {SVGSVGElement} */
    svgEl: null,
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
  },

  methods: {
    colorJsonToSvg(json) {
      this.svgEl = Object.freeze(convObjToSvg2(json));
      this.colorPaleteSvg = this.svgEl.outerHTML;
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
