import * as Alexa from "ask-sdk";
import {getData} from "../api/api";
import {IntentRequest} from "ask-sdk-model";
import {LocationParser} from "../util/location-parser";

export const AskTemperatureIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "AskTemperature";
  },
  handle(handlerInput) {
    const location = LocationParser.getLocationFromRequest(handlerInput.requestEnvelope.request as IntentRequest);

    return getData().then(data => {
      let speechText;
      switch (location) {
        case "inside":
          speechText = `It is ${data.tempIn} degrees inside`;
          break;
        case "outside":
          speechText = `It is ${data.tempOut} degrees outside`;
          break;
        case "all":
          speechText = `It is ${data.tempIn} degrees inside and ${data.tempOut} degrees outside`;
          break;
        default:
          if (data.extraModules.hasOwnProperty(location)) {
            const locationData = data.extraModules[location];
            speechText = `It is ${locationData.temp} degrees in the ${location}`;
          } else {
            speechText = `Sorry. There's no location called ${location}`;
          }
      }

      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard("Netatmo Temperature", speechText)
        .getResponse();
    });
  }
};
