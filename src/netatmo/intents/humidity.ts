import * as Alexa from "ask-sdk";
import {LocationParser} from "../util/location-parser";
import {IntentRequest} from "ask-sdk-model";
import {getData} from "../api/api";

export const AskHumidityIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "AskHumidity";
  },
  handle(handlerInput) {
    const location = LocationParser.getLocationFromRequest(handlerInput.requestEnvelope.request as IntentRequest);

    return getData().then(data => {
      let speechText;
      switch (location) {
        case "inside":
          speechText = `The humidity inside is ${data.humIn}%`;
          break;
        case "outside":
          speechText = `The humidity outside is ${data.humOut}%`;
          break;
        case "all":
          speechText = `The humidity is ${data.humIn}% inside and ${data.humOut}% outside`;
          break;
        default:
          if (data.extraModules.hasOwnProperty(location)) {
            const locationData = data.extraModules[location];
            speechText = `The humidity is ${locationData.hum} % in the ${location}.`;
          } else {
            speechText = `Sorry. There's no location called ${location}.`;
          }
      }

      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard("Netatmo Humidity", speechText)
        .getResponse();
    });
  }
};
