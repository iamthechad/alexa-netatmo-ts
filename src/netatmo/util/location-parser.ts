import {IntentRequest} from "ask-sdk-model";

export class LocationParser {

  private static readonly LOCATION_SLOT = "LOCATION";

  public static getLocationFromRequest(request: IntentRequest): string {
    let location = "all";
    const slots = request.intent.slots;
    if (slots) {
      const slot = slots[this.LOCATION_SLOT];
      if (slot && slot.value && slot.value !== "undefined" && slot.value !== "") {
        location = slot.value;
      }
    }
    return location;
  }
}
