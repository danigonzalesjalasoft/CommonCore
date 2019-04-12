'use strict';

const Common = require('./common.js');

const HEADER_LOCATOR = 'tr th';
const ROW_LOCATOR = './tbody/tr';
const CELL_LOCATOR = 'td';

/**
 * Util class to handle table element.
 */
class TableUtil {

    /**
     * Method to get webElement table
     * @param webElementTable
     * @returns {WebdriverIO.Element} table
     */
    static getTable(webElementTable) {
        return Common.getWebElement(webElementTable);
    }

    /**
     * Method to get Columns from table
     * @param {string} elementTable, represents the locator for the table
     * @return {Object}, All columns with header as key.
     * e.g.:
     * {header1: allHeaderColumnValue1, header2: allHeaderColumnValue2, ...}
     */
    static getColumns(elementTable) {
        let listColumnValues = {};
        const table = this.getTable(elementTable);
        const headersList = Common.getWebElementListFromBase(table, HEADER_LOCATOR);
        headersList.forEach((header, index) => {
            let UiValue = Common.getWebElementFromBase(table, `${ROW_LOCATOR}/${CELL_LOCATOR}[${index + 1}]`);
            listColumnValues[Common.getTextFromWebElement(header)] = Common.getTextFromWebElement(UiValue);
        });
        return listColumnValues;
    }


    /**
     * Method to get values from row by key from first column
     * @param {string} elementTable, represents the locator for the table
     * @param {string} nameHeader, represents the name header that will be used like as key column
     * @return {Object}, Entire row with all values as Object of according to key selected.
     * e.g.:
     *  { "10/25/18": {day: Value1, total: Value2, unit: Value3},
     *    "10/26/18": {day: Value1, total: Value2, unit: Value3},
     *    "10/27/18": {day: Value1, total: Value2, unit: Value3},
      *    ...}
     */
    static getRows(elementTable, nameHeader) {
        let finalList = {};
        const table = this.getTable(elementTable);
        const headersList = Common.getWebElementListFromBase(table, HEADER_LOCATOR);
        const rows = Common.getWebElementListFromBase(table, ROW_LOCATOR);
        rows.forEach(row => {
            let listRowValues = {};
            headersList.forEach((header, index) => {
                const cellValue = Common.getWebElementFromBase(row, `./${CELL_LOCATOR}[${index + 1}]`);
                listRowValues[Common.getTextFromWebElement(header)] = Common.getTextFromWebElement(cellValue);
            });
            finalList[listRowValues[nameHeader]] = listRowValues;
        });
        return finalList;
    }
}

module.exports = TableUtil;
