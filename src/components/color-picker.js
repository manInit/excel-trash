class ColorPicker extends HTMLElement {
  color;

  resetColorChoice(colors) {
    for (const color of colors) {
      color.classList.remove("color-picker_active");
    }
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="color-picker">
        <div class="color-picker__colors">
          <div class="color-picker__color color-picker__color_green"></div>
          <div class="color-picker__color color-picker__color_yellow"></div>
          <div class="color-picker__color color-picker__color_red"></div>
        </div>
        <button class="color-picker__apply">Установить</button>
        <button class="color-picker__reset">Сбросить</button>
      </div>
    `;
    const green = this.querySelector(".color-picker__color_green");
    const yellow = this.querySelector(".color-picker__color_yellow");
    const red = this.querySelector(".color-picker__color_red");
    const colorsElem = [green, yellow, red];
    const btnApply = this.querySelector(".color-picker__apply");
    const btnReset = this.querySelector(".color-picker__reset");

    const initColor = this.getAttribute("value");
    switch (initColor) {
      case "92D050":
        this.color = "92D050";
        this.resetColorChoice(colorsElem);
        green.classList.add("color-picker_active");
        break;
      case "FFFF00":
        this.color = "FFFF00";
        this.resetColorChoice(colorsElem);
        yellow.classList.add("color-picker_active");
        break;
      case "FF0000":
        this.color = "FF0000";
        this.resetColorChoice(colorsElem);
        red.classList.add("color-picker_active");
        break;
    }

    green.addEventListener("click", (e) => {
      this.color = "92D050";
      this.resetColorChoice(colorsElem);
      green.classList.add("color-picker_active");
    });
    yellow.addEventListener("click", (e) => {
      this.color = "FFFF00";
      this.resetColorChoice(colorsElem);
      yellow.classList.add("color-picker_active");
    });
    red.addEventListener("click", (e) => {
      this.color = "FF0000";
      this.resetColorChoice(colorsElem);
      red.classList.add("color-picker_active");
    });
    btnReset.addEventListener("click", (e) => {
      this.color = "FFFFFF";
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: this.color,
        })
      );
    });
    btnApply.addEventListener("click", (e) => {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: this.color,
        })
      );
    });
  }
}

export default ColorPicker;
