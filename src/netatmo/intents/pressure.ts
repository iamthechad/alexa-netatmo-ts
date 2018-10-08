import * as Alexa from "ask-sdk";
import {getData} from "../api/api";

export const AskPressureIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "AskPressure";
  },
  handle(handlerInput) {
    return getData().then(data => {
      const speechText = `The air pressure is ${data.press} ${data.pressUnits}.`;
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard("Netatmo Air Pressure", speechText)
        .getResponse();
    });
  }
};
