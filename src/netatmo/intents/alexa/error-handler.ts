import * as Alexa from "ask-sdk";

export const ErrorHandler: Alexa.ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    /* tslint:disable-next-line:no-console */
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, something went wrong. Please try again.")
      .reprompt("Sorry, something went wrong. Please try again.")
      .getResponse();
  },
};
