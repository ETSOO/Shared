import { EColor } from "./types/EColor";

/**
 * Color utils
 */
export namespace ColorUtils {
  /**
   * Get HEX or RGB colors
   * @param init Initial color
   * @param factor Increase factor
   * @param adjustOrder Adjust order to increase difference
   * @param hex to HEX or not
   * @returns Result
   */
  export function getColors(
    init: string = "#000",
    factor: number = 51,
    adjustOrder: boolean = true,
    hex: boolean = true
  ) {
    return getEColors(init, factor, adjustOrder).map((c) =>
      hex ? c.toHEXColor() : c.toRGBColor()
    );
  }

  /**
   * Get EColors
   * @param init Initial color
   * @param factor Increase factor
   * @param adjustOrder Adjust order to increase difference
   * @returns Result
   */
  export function getEColors(
    init: string = "#000",
    factor: number = 51,
    adjustOrder: boolean = true
  ): EColor[] {
    // Init color
    const initColor = EColor.parse(init) ?? new EColor(0, 0, 0);

    // Factors elements
    // 51 = '00', '33', '66', '99', 'cc', 'ff'
    const factors: number[] = [];
    let f = 0;
    while (f <= 255) {
      factors.push(f);
      f += factor;
    }

    // RGB loop
    const colors: (EColor | undefined)[] = [initColor];
    for (const r of factors) {
      for (const g of factors) {
        for (const b of factors) {
          colors.push(initColor.clone(r, g, b));
        }
      }
    }

    // Non-nullable colors
    const nColors = colors.filter((color): color is EColor => color != null);

    // Adjust order
    if (adjustOrder) {
      const firstColor = nColors.shift();
      if (firstColor) {
        let color = firstColor;
        const newColors: EColor[] = [color];

        while (nColors.length > 0) {
          const result = nColors.reduce(
            (p, c, index) => {
              const delta = color.getDeltaValue(c);
              if (delta != null && delta > p.delta) {
                p.delta = delta;
                p.color = c;
                p.index = index;
              }
              return p;
            },
            { delta: 0, color, index: -1 }
          );

          if (result.delta > 0) {
            color = result.color;
            newColors.push(color);
            nColors.splice(result.index, 1);
          }
        }

        return newColors;
      }
    }

    return nColors;
  }
}
