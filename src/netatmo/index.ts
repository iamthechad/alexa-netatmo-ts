import * as Alexa from "ask-sdk";
import {AskTemperatureIntentHandler} from "./intents/temperature";
import {AskHumidityIntentHandler} from "./intents/humidity";
import {AskCarbonDioxideIntentHandler} from "./intents/carbondioxide";
import {AskPressureIntentHandler} from "./intents/pressure";
import {AskRainIntentHandler} from "./intents/rain";
import {AskSoundIntentHandler} from "./intents/sound";
import {HelpIntentHandler} from "./intents/alexa/help";
import {LaunchRequestHandler} from "./intents/alexa/launch";
import {SessionEndedRequestHandler} from "./intents/alexa/session-end";
import {ErrorHandler} from "./intents/alexa/error-handler";

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AskTemperatureIntentHandler,
    AskHumidityIntentHandler,
    AskCarbonDioxideIntentHandler,
    AskPressureIntentHandler,
    AskRainIntentHandler,
    AskSoundIntentHandler,
    HelpIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
