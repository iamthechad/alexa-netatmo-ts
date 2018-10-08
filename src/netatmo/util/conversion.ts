export class Conversion {
  private static readonly MBAR_TO_INHG = 0.02953;
  private static readonly MBAR_TO_MMHG = 0.750062;

  private static readonly MM_TO_INCHES = 0.0393701;

  public static convertTemperature(originalValue: number, naUserSetting: number): number {
    if (naUserSetting === 0) {
      return this.roundNumber(originalValue);
    }

    return this.roundNumber(originalValue * (9 / 5) + 32);
  }

  public static convertRain(originalValue: number, naUserSetting: number): number {
    if (naUserSetting === 0) {
      return this.roundNumberWithPrecision(originalValue, 2);
    }

    return this.roundNumberWithPrecision(originalValue * this.MM_TO_INCHES, 2);
  }

  public static convertPressure(originalValue: number, naUserSetting: number): number {
    var retValue;
    switch (naUserSetting) {
      case 1:
        retValue = originalValue * this.MBAR_TO_INHG;
        break;
      case 2:
        retValue = originalValue * this.MBAR_TO_MMHG;
        break;
      default:
        retValue = originalValue;
    }
    return this.roundNumber(retValue);
  }

  public static getPressureUnitsString(naUserSetting: number): string {
    switch (naUserSetting) {
      case 0:
        return 'millibars';
      case 1:
        return 'inches mercury';
      case 2:
        return 'millimeters mercury';
      default:
        return '';
    }
  }

  private static roundNumber(value: number): number {
    return this.roundNumberWithPrecision(value, 1);
  }

  private static roundNumberWithPrecision(value: number, precision: number): number {
    var roundVar = 10;
    if (precision > 1) {
      for (var i = 0; i < precision; i++) {
        roundVar *= 10;
      }
    }
    return Math.ceil(value * roundVar) / roundVar;
  }
}
