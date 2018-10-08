import * as Alexa from "ask-sdk";
import {getData} from "../api/api";

export const AskRainIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "AskRain";
  },
  handle(handlerInput) {
    return getData().then(data => {
      let speechText = `It is currently ${(data.rain.raining ? "" : "not")} raining. `;
      speechText += `In the last hour there has been ${data.rain.lastHour} ${data.rain.units} of rain, `;
      speechText += `and ${data.rain.lastDay} ${data.rain.units} in the last 24 hours.`;
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard("Netatmo Rain", speechText)
        .getResponse();
    });
  }
};
