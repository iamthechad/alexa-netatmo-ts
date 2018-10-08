import * as Alexa from "ask-sdk";
import {getData} from "../api/api";

export const AskSoundIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "AskSound";
  },
  handle(handlerInput) {
    return getData().then(data => {
      const speechText = `The sound level is ${data.sound} decibels.`;
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard("Netatmo Sound Level", speechText)
        .getResponse();
    });
  }
};
