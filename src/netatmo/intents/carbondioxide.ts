import * as Alexa from "ask-sdk";
import {LocationParser} from "../util/location-parser";
import {IntentRequest} from "ask-sdk-model";
import {getData} from "../api/api";

export const AskCarbonDioxideIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "AskCarbonDioxide";
  },
  handle(handlerInput) {
    const location = LocationParser.getLocationFromRequest(handlerInput.requestEnvelope.request as IntentRequest);

    return getData().then(data => {
      let speechText;
      switch (location) {
        case "inside":
          speechText = `The carbon dioxide level inside is ${data.co2}.`;
          break;
        case "outside":
          speechText = "Sorry, I can only tell carbon dioxide levels for indoor monitors.";
          break;
        case "all":
          speechText = `The carbon dioxide level inside is ${data.co2}.`;
          for (const moduleName in data.extraModules) {
            if (data.extraModules.hasOwnProperty(moduleName)) {
              const module = data.extraModules[moduleName];
              if (module.hasOwnProperty("co2")) {
                speechText += ` The level is ${module.co2} in the ${module.name}.`;
              }
            }
          }
          break;
        default:
          if (data.extraModules.hasOwnProperty(location)) {
            const locationData = data.extraModules[location];
            speechText = `The carbon dioxide level is ${locationData.co2} in the ${locationData.name}.`;
          } else {
            speechText = `Sorry. There's no location called ${location}.`;
          }
      }

      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard("Netatmo Carbon Dioxide", speechText)
        .getResponse();
    });
  }
};
