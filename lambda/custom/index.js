'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = undefined;

const SKILL_NAME = 'Daily Doctor';
const INITIAL_MESSAGE = "Is there any pain or discomfort?";
const HELP_MESSAGE = 'You can say tell me a penis fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, customHandlers, redoHandler, finishHandler);
    alexa.execute();
};

// Launch the Alexa skill
const newSessionHandler = {
    LaunchRequest() {
        this.handler.state = "ASKMODE";
        this.emit(":ask", "Welcome to Daily Doctor. Are you feeling any pain or discomfort?");
    }
};

const startGameHandlers = Alexa.CreateStateHandler("ASKMODE", {
    "AMAZON.YesIntent": function () {
        this.emitWithState("AskPain");
    },
    "AMAZON.NoIntent": function () {
        this.handler.state = "FINISHMODE";
        this.emitWithState("FinishIntent");
    },
    "AskPain": function () {
        this.handler.state = "CUSTOMANSWERMODE";
        this.emit(":ask", 'Please specify the area of discomfort or pain');
    },
    "AskRating": function () {
      this.handler.state = "CUSTOMANSWERMODE";
      this.emit(":ask", 'Please rate your discomfort on a scale from one to five, five being extreme pain and one being no pain.')
    },
    "AdditionalDetails": function () {
        this.handler.state = "REDOMODE";
        this.emit(":ask", 'Thank you, would you like to log any additional pain or discomfort?');
    }
});

const askQuestionHandlers = Alexa.CreateStateHandler("ANSWERMODE", {
    "AMAZON.YesIntent": function () {
        this.handler.state = "ASKMODE";
        this.emitWithState("FinishIntent");
    },
    "AMAZON.NoIntent": function () {
        this.handler.state = "FINISHMODE";
        this.emitWithState("FinishIntent");
    }
});

const customHandlers = Alexa.CreateStateHandler("CUSTOMANSWERMODE", {
    "logPain": function () {
        this.handler.state = "ASKMODE";
        this.emitWithState("AskRating");
    },
    "painRating": function () {
        this.handler.state = "ASKMODE";
        this.emitWithState("AdditionalDetails");
    }
});

// Ask if there are any additional pain/discomforts
const redoHandler = Alexa.CreateStateHandler("REDOMODE", {
    "AMAZON.YesIntent": function () {
        this.handler.state = "ASKMODE";
        this.emitWithState("AskPain");
    },
    "AMAZON.NoIntent": function () {
        this.handler.state = "FINISHMODE";
        this.emitWithState("FinishIntent");
    }
});

// Finish state
const finishHandler = Alexa.CreateStateHandler("FINISHMODE", {
   "FinishIntent": function() {
       this.emit(":tell", "Thank you for logging your health. Have a good day!");
   } 
});