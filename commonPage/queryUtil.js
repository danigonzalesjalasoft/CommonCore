'use strict';

const GmailConnection = require('../../../api/gmail/connection.js');

const request = require('../../../testData/gmail/request.json');

/**
 * Util class to handle queries and access Gmail API.
 */
class QueryUtil {

    /**
     * Get list of parameter from the query json File.
     * @param {string} query, Is the information obtained from the query.json
     * @returns {Array<string>} list Of parameters.
     */
    static getListParameter(query) {
        const regexForParameterList = /(%\w*?%)/g;
        let listOfParameters = [];
        try {
            listOfParameters = query.match(regexForParameterList);
        } catch (error) {
            throw new Error(error);
        }
        return listOfParameters;
    }

    /**
     * Get a list of messages
     * The method receive a json file.
     * You can create a query and pass parameters to the following
     * case where% ORDER_ID% and% DATE_VALUE% are the parameters.
     * {
     *     "byOrderIdAndDate": "subject:%ORDER_ID% AND after:%DATE_VALUE%"
     * }
     * @param jsonQuery Is the information obtained from the query.json
     * @param valueOfTheParameters is a list of parameters.
     * @returns {Array<Object>} of messages
     */
    static getListOfMessage(jsonQuery, ...valueOfTheParameters) {
        let query = jsonQuery;
        let parameters = this.getListParameter(jsonQuery);
        parameters.forEach((parameter, index) => {
            query = query.replace(parameter, valueOfTheParameters[index]);
        });
        //q is the default parameter of the Gmail API that receives a query.
        request.q = query;
        return GmailConnection.getMessagesByQuery(request);
    }

    /**
     * Get number of mails
     * The method receive a json file.
     * You can create a query and pass parameters to the following
     * case where% ORDER_ID% and% DATE_VALUE% are the parameters.
     * {
     *     "byOrderIdAndDate": "subject:%ORDER_ID% AND after:%DATE_VALUE%"
     * }
     * @param amountExpectedMails amount of mail expected
     * @param jsonQuery Is the information obtained from the query.json
     * @param valueOfTheParameters is a list of parameters.
     * @returns {number} number of messages
     */
    static getNumberOfEmails(amountExpectedMails, jsonQuery, ...valueOfTheParameters) {
        let query = jsonQuery;
        let parameters = this.getListParameter(jsonQuery);
        parameters.forEach((parameter, index) => {
            query = query.replace(parameter, valueOfTheParameters[index]);
        });
        //q is the default parameter of the Gmail API that receives a query.
        request.q = query;
        return GmailConnection.getCountMessagesByQuery(amountExpectedMails, request);
    }
}

module.exports = QueryUtil;
