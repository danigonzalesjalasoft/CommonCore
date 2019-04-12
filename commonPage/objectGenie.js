'use strict';

const Navigator = require('./navigatorPage.js');
const Common = require('./common.js');

const ScriptLicenseConfigurationPage = require('../products/fulfillment/license/addScriptLicenseConfiguration.js');
const AddLicenseListConfigurationPage = require('../products/fulfillment/license/addLicenseListConfiguration.js');
const MenuBar = require('../menu/menuBar.js');
const editEmail = require('../../classic/products/fulfillment/sendEmail/editEmailPage.js');
const OfferAddsPage = require('../order/offerAddsPage.js');
const PhysicalFulfillmentPage = require('../products/fulfillment/shipCdDrive/physicalFulfillmentPage.js');
const AddPhysicalFulfillmentPage = require('../products/fulfillment/shipCdDrive/addPhysicalFulfillmentPage.js');

/**
 * The class models the NavigatorPage page.
 */
class ObjectGenie {

    /**
     * Create a subscription product.
     * @param subscriptionInfo
     * @return {subscription product created}
     */
    static createSubscriptionProduct(subscriptionInfo) {
        let subscription, productAndPage;
        productAndPage = Navigator.goToProductsAndPages();
        subscription = productAndPage.clickCreateSubscription();
        return subscription.createSubscription(subscriptionInfo);
    }

    /**
     * Method to complete form in cart Page
     * @param {Object} cartPage, instance of Cart Page
     * @param {Object} orderDetails, Info to set order details
     * @returns {ContentsPage}
     */
    static completeFormCartPage(cartPage, orderDetails) {
        if ('cartForm' in orderDetails) {
            cartPage.fillOrderDetails(orderDetails.cartForm);
        }
        return cartPage.clickAddOrder();
    }

    /**
     * Method to complete form in Offer Add Page
     * Page dedicated to Offers
     * @param {Object} orderDetails, Info to set order details
     */
    static completeFormOfferAddPage(orderDetails) {
        if ((browser.getUrl()).includes('offer_adds')) {
            let offerAddsPage = new OfferAddsPage();
            if ('offerAddsForm' in orderDetails) {
                offerAddsPage.fillOrderDetails(orderDetails.offerAddsForm);
            }
            offerAddsPage.clickNext();
        }
    }

    /**
     * Method to complete form in Contents Page
     * @param contentsPage, instance of Contents Page
     * @param {Object} orderDetails, Info to set order details
     * @returns {CustomerPage}
     */
    static completeFormContentPage(contentsPage, orderDetails) {
        if ('contentsForm' in orderDetails) {
            contentsPage.fillOrderDetails(orderDetails.contentsForm);
        }
        return contentsPage.clickOrderNow();
    }

    /**
     * Method to complete form in Customer Page
     * @param customerPage, instance of Customer Page
     * @param {Object} orderDetails, Info to set order details
     * @returns {ConfirmPage}
     */
    static completeFormCustomerPage(customerPage, orderDetails) {
        if ('customerForm' in orderDetails) {
            customerPage.fillOrderDetails(orderDetails.customerForm);
        }
        return customerPage.clickNext();
    }

    /**
     * Method to complete form in Confirm Page
     * @param confirmPage, instance of Confirm Page
     * @param {Object} orderDetails, Info to set order details
     * @returns {CompletePage}
     */
    static completeFormConfirmPage(confirmPage, orderDetails) {
        if ('confirmForm' in orderDetails) {
            confirmPage.fillOrderDetails(orderDetails.confirmForm);
        }
        return confirmPage.clickCompleteOrder();
    }

    /**
     * Create Subscription or Product order.
     * @param {Object} subscriptionProduct, represent the subscription or product name
     * @param {Object} orderDetails, Info to set order details
     * @returns string, Order ID
     */
    static createSubscriptionProductOrder(subscriptionProduct, orderDetails) {
        const completePage = this.createSubscriptionProductOrderSteps(subscriptionProduct, orderDetails);
        return completePage.getOrderId();
    }

    /**
     * Create a Subscription Product order.
     * @param {Object} subscriptionProduct The subscription product data to order.
     * @param {Object} orderDetails Info to set in the order.
     * @returns {CompletePage} The last page of the order wizard.
     */
    static createSubscriptionProductOrderSteps(subscriptionProduct, orderDetails) {
        const storeTestingClassicPage = Navigator.goToStoreSubscription(subscriptionProduct);
        const cartPage = storeTestingClassicPage.clickCart();
        const contentPage = this.completeFormCartPage(cartPage, orderDetails);
        this.completeFormOfferAddPage(orderDetails);
        const customerPage = this.completeFormContentPage(contentPage, orderDetails);
        const confirmPage = this.completeFormCustomerPage(customerPage, orderDetails);
        return this.completeFormConfirmPage(confirmPage, orderDetails);
    }

    /**
     * Select product and provider to add fill to shipment.
     * @param {string} productName is name of product.
     * @param {json} shipmentProviderObject information to set fulfillment shipment.
     */
    static selectProviderToChooseShipment(productName, shipmentProviderObject) {

        //Navigate to the selected product.
        const addFulfilmentActionPage = Navigator.goToAddFulfillmentActionForSubscription(productName);

        //selected the type of shipment and provider between AcuaTrack and CustomCD.
        addFulfilmentActionPage.fillTypeOffShipment(shipmentProviderObject.name);
        const addPhysicalFulfillmentPage = new AddPhysicalFulfillmentPage();
        addPhysicalFulfillmentPage.selectPhysicalFulFillment(shipmentProviderObject);
        const physicalFulfillmentPage = new PhysicalFulfillmentPage();
        physicalFulfillmentPage.clickSave();
    }

    /**
     * Search Subscription order.
     * @param orderId
     * @returns {ViewSubscriptionPage}
     */
    static searchSubscriptionProductOrder(orderId) {
        const orderDetail = Navigator.goToOrderSearch(orderId);
        return orderDetail.clickViewSubscription();
    }

    /**
     * Disable a specific subscription product.
     * @param productDetails
     */
    static disableSubscriptionProduct(productDetails) {
        let subscriptionDetails = Navigator.goToSubscription(productDetails);
        let productStatus = subscriptionDetails.clickStatus();
        productStatus.clickDisable();
    }

    /**
     * disable multiple subscriptions product
     * @param productArray
     */
    static disableMultipleSubscriptionProduct(productArray) {
        let subscriptioToDisable;
        if (productArray.length > 0) {
            subscriptioToDisable = productArray.pop();
            if (subscriptioToDisable) {
                if ('name' in subscriptioToDisable) {
                    Navigator.goToHome();
                    this.disableSubscriptionProduct(subscriptioToDisable.name);
                }
                else {
                    browser.logger.error('The subscription to delete does not have the name key.');
                }
            }
            else {
                browser.logger.error('Undefined value has been passed as subscription to delete.');
            }
            this.disableMultipleSubscriptionProduct(productArray);
        } else {
            return productArray;
        }
    }

    /**
     * Method that provides the download of files to the product.
     * @param {string} productName is name of product.
     * @param fulfillmentActionFormData {Json} information about fulfillmentAction.
     * @param addFileConfigurationData {Json} information about configuration.
     * @returns {string} The value of the info message.
     */
    static provideFileDownloadToTheProduct(productName, fulfillmentActionFormData,
                                           addFileConfigurationData) {
        let addFulfilmentActionPage = Navigator.goToAddFulfillmentActionForSubscription(productName);
        let uploadPage = addFulfilmentActionPage.fillProvideFileDownloadForm(
            fulfillmentActionFormData.provideAFileDownload);
        uploadPage.uploadFile(addFileConfigurationData.chooseFile.filePath);
        uploadPage.clickVerify();
        Common.waitUntil(() => {
            return new MenuBar().getInfoMessage().includes('Received uploaded file');
        }, 'The file has not been uploaded successfully');
    }

    /**
     * Add to the subscription a Provide a File Download (fulfillment action)
     * The Provide a File Download is going to be Upload from Web Browser.
     * Example of valid fulfillmentActionFormData and addFileConfigurationData see :
     * .\test\testData\ProvideAFileDownloadUploadFromBrowserData.json
     * @param {string} subscriptionName The name of the subscription to add the Provide a File Download (fulfillment action).
     * @param {Json} fulfillmentActionFormData The Json with the configuration for the Fulfillment Action form.
     * @param {Json} addFileConfigurationData The Json with the configuration for the Add File Configuration form.
     */
    static provideFileBrowserUpload(subscriptionName, fulfillmentActionFormData,
                                    addFileConfigurationData) {
        let addFulfilmentActionPage = Navigator.goToAddFulfillmentActionForSubscription(subscriptionName);
        let uploadPage = addFulfilmentActionPage.fillProvideFileDownloadForm(
            fulfillmentActionFormData.provideAFileDownload);
        uploadPage.uploadFile(addFileConfigurationData.chooseFile.filePath);
        uploadPage.clickVerify();
        Common.waitUntil(() => {
            return new MenuBar().getInfoMessage().includes('Received uploaded file');
        }, 'The file has not been uploaded successfully');
    }

    /**
     * Add to the subscription a Signed PDF (fulfillment action)
     * The Signed PDF is going to be Upload from Web Browser.
     * Example of valid fulfillmentActionFormData and addPDFLicenseConfigurationData see :
     * .\test\testData\createASignedPDFUploadFromBrowserData.json
     * @param {string} subscriptionName The name of the subscription to add the Signed PDF (fulfillment action).
     * @param {Json} fulfillmentActionFormData The Json with the configuration for the Fulfillment Action form.
     * @param {Json} addPDFLicenseConfigurationData The Json with the configuration for the Add File Configuration form.
     */
    static signedPdfBrowserUpload(subscriptionName, fulfillmentActionFormData,
                                  addPDFLicenseConfigurationData) {
        let addFulfilmentActionPage = Navigator.goToAddFulfillmentActionForSubscription(subscriptionName);
        let uploadPage = addFulfilmentActionPage.fillCreateASignedPDF(
            fulfillmentActionFormData.createASignedPDF);
        uploadPage.uploadFile(addPDFLicenseConfigurationData.chooseFile.filePath);
        uploadPage.fillVerifyAddPDFLicenseConfigurationForm(addPDFLicenseConfigurationData.verifyFile);
        uploadPage.clickVerify();
        Common.waitUntil(() => {
            return new MenuBar().getInfoMessage().includes('Received uploaded file');
        }, 'The file has not been uploaded successfully');
    }

    /**
     * Add to the subscription a pre-defined license list (fulfillment action)
     * Example of valid fulfillmentActionFormData and addLicenseListConfigurationData see:
     * .\test\testData\generateAPredefinedLicenseList.json
     * @param {string} subscriptionName The name of the subscription product.
     * @param {json} fulfillmentActionFormData The Json with the configuration for the Fulfillment Action form.
     * @param {json} addLicenseListConfigurationData The Json with the configuration for the Add License Configuration form.
     */
    static predefinedLicenseList(subscriptionName, fulfillmentActionFormData,
                                 addLicenseListConfigurationData) {
        let addFulfilmentActionPage = Navigator.goToAddFulfillmentActionForSubscription(subscriptionName);
        addFulfilmentActionPage.fillGenerateALicense(
            fulfillmentActionFormData.generateALicense);
        let licenseListConfigurationPage = new AddLicenseListConfigurationPage();
        licenseListConfigurationPage.fillAddLicenseListConfiguration(addLicenseListConfigurationData);
        licenseListConfigurationPage.clickCreate();
        licenseListConfigurationPage.clickSave();
    }

    /**
     * Add to the subscription a script license (fulfillment action)
     * Example of valid fulfillmentActionFormData and addScriptLicenseConfigurationData see:
     * .\test\testData\generateLicenseUsingScript.json
     * @param subscriptionName The name of the subscription product.
     * @param fulfillmentActionFormData The Json with the configuration for the Fulfillment Action form
     * @param addScriptLicenseConfigurationData The Json with the configuration for the Script License form.
     */
    static generateLicenseUsingScript(subscriptionName, fulfillmentActionFormData,
                                      addScriptLicenseConfigurationData) {
        let addFulfilmentActionPage = Navigator.goToAddFulfillmentActionForSubscription(subscriptionName);
        addFulfilmentActionPage.fillGenerateALicense(
            fulfillmentActionFormData.generateALicense);
        let scriptLicenseConfigurationPage = new ScriptLicenseConfigurationPage();
        scriptLicenseConfigurationPage.fillScriptLicenseConfiguration(addScriptLicenseConfigurationData.generalCreation);
        scriptLicenseConfigurationPage.clickCreate();
        scriptLicenseConfigurationPage.fillEditScriptLicenseConfigurationGeneralTab(addScriptLicenseConfigurationData.generalEdition);
        scriptLicenseConfigurationPage.fillEditScriptLicenseConfigurationAdvancedTab(addScriptLicenseConfigurationData.advancedEdition);
        scriptLicenseConfigurationPage.clickSave();
    }

    /**
     * Method to create an Email to send by fulfillment
     * To create a email in fulfillment is necessary to follow two steps in the same flow:
     * 1) Create email and 2) Edit email
     * For the second step (edit email), is possible save the created email without changes.
     * Each step contains different information according to data present in the json
     *
     * Example with data to create and edit email:
     * {
     *   "addEmailFulfillment": {
     *     "reuseOptions": "One-Time Use Only",
     *     "emailSubject": "Your #{orderItem.display} Delivery Information"
     *    },
     *    "editEmail": {
     *     "emailTextContents": "This is a email Text Context test"
     *    }
     *  }
     *
     *  Example with data to create email without edit email:
     * {
     *   "addEmailFulfillment": {
     *     "reuseOptions": "One-Time Use Only",
     *     "emailSubject": "Your #{orderItem.display} Delivery Information"
     *     "emailTextContents": "This is a email Text Context test"
     *    }
     *  }
     *
     * @param {string} subscriptionName, The name of the subscription to add the created email
     * @param {Json} emailFulfillmentInfo, Information to create and edit email
     * @returns {Object} Email info to send as Object
     */
    static createEmailFulfillment(subscriptionName, emailFulfillmentInfo) {
        let createEmailInfo = emailFulfillmentInfo.addEmailFulfillment;
        let editEmailInfo = emailFulfillmentInfo.editEmail;
        let addFulfillmentActionPage = Navigator.goToAddFulfillmentActionForSubscription(subscriptionName);
        let addEmailPage = addFulfillmentActionPage.selectSendEmailOption();
        let createdEmail = addEmailPage.createEmailToSend(createEmailInfo);
        let editEmailPage = new editEmail();
        if (editEmailInfo) {
            let editedEmail = editEmailPage.editEmailToSend(editEmailInfo);
            createdEmail = Object.assign(createdEmail, editedEmail);
        } else {
            editEmailPage.clickSave();
        }
        return createdEmail;
    }

    /**
     * Delete a container page
     * @param {object} containerPageInfo
     */
    static deleteContainerPage(containerPageInfo) {
        Navigator.goToHome();
        const containerDetailPage = Navigator.goToContainerPage(containerPageInfo.name);
        containerDetailPage.clickDelete();
        Navigator.goToHome();
    }

    /**
     * Method create an object of Cross Sell Offer
     * @param crossSellToCreate, object with information to create Cross-Sell object
     * @param productsToOffer
     * @param productWithOffer
     * @returns {Object} of Cross Sell Offer
     */
    static createCrossSell(crossSellToCreate, productsToOffer, productWithOffer) {
        let createCrossSellPage = Navigator.goToCreateCrossSell();
        crossSellToCreate.productsToOffer = productsToOffer.map(product => product.name);
        crossSellToCreate.drivingProduct = productWithOffer.name;
        return createCrossSellPage.createCrossSell(crossSellToCreate);
    }

    /**
     * Method to create a new product
     * @param productToCreateData, hash with information to create Product
     * @returns {Object} of Created Product
     */
    static createProduct(productToCreateData) {
        let product = Navigator.goToCreateProduct();
        return product.createProduct(productToCreateData);
    }

    /**
     * Method to delete multiple Offers
     * @param offersArray, Array with Offers object
     */
    static deleteMultipleOffers(offersArray) {
        while (offersArray.length > 0) {
            this.deleteOffer(offersArray.pop());
            this.deleteMultipleOffers(offersArray);
        }
    }

    /**
     * Method to delete an Offer
     * @param offer, Offer object
     */
    static deleteOffer(offer) {
        let offerDetail = Navigator.goToOffer(offer.name);
        let offerStatus = offerDetail.clickStatus();
        offerStatus.clickDelete();
        Common.alertAccept();
    }

    /**
     * Edits a subscription or product
     * @param {string} subscriptionProductName The name of the subscription to edit.
     * @param {json} subscriptionProductInfo  The info to the edit form.
     */
    static editSubscriptionProduct(subscriptionProductName, subscriptionProductInfo) {
        let editSubscriptionProduct, productDetails;
        productDetails = Navigator.goToSubscription(subscriptionProductName);
        editSubscriptionProduct = productDetails.clickEditGeneral();
        return editSubscriptionProduct.fillEditForm(subscriptionProductInfo);
    }

    /**
     * Create and confirm a new order using the Order Creator
     * @param {json} orderDetails The Order Details for the order.
     * @param {boolean} sendMail Wheather the send mail check must be checked.
     * @returns {{paymentURL: string, orderId: string, orderDetails: *}}
     */
    static createOrderWithOrderCreator(orderDetails, sendMail) {
        // Go to Order Creator Page.
        let orderCreatorPage = Navigator.goToOrderCreator();
        // Fill the Order creator form.
        orderCreatorPage.fillOrder(orderDetails.createForm);
        let editOrder = orderCreatorPage.clickNext();
        // Edit and Add the items to the order.
        editOrder.fillEditOrder(orderDetails.editForm);
        editOrder.checkSendCustomerPaymentInstructionsEmail(sendMail);
        // Confirm the data of the order.
        let orderDetailsPage = editOrder.clickConfirm();
        // Getting the Payment URL from FastSpring.
        let paymentUrl = orderDetailsPage.getViewPaymentUrl();
        // Getting the created orderID.
        let orderId = orderDetailsPage.getOrderId();

        return {paymentURL: paymentUrl, orderId: orderId, orderDetails: orderDetails};
    }

    /**
     * Set the subscriptions or products to test.
     * @param {object} subscriptionProductList The list of products and subscriptions to set to test.
     */
    static setSubscriptionProductToTest(subscriptionProductList) {
        subscriptionProductList.forEach((product) => {
            let productDetails = Navigator.goToProduct(product.name);
            productDetails.setTest();
        });
    }

    /**
     * Delete a Template page.
     * @param {object} templatePageInfo
     */
    static deleteTemplatePage(templatePageInfo) {
        const templateDetailPage = Navigator.goToTemplatePage(templatePageInfo.name);
        templateDetailPage.clickDelete();
        Navigator.goToHome();
    }

    /**
     * Method to create a discount
     * @param {Json} discountInfo, information to create a coupon
     * @returns {Object} created Discount
     */
    static createDiscount(discountInfo) {
        let createCouponPage = Navigator.goToCreateCoupon();
        return createCouponPage.createDiscount(discountInfo);
    }

    /**
     * Click the Group choices link in a newly created subscription and add new choices.
     * @param {string} subscriptionName The subscription to add the Group Choice.
     * @param {Object} configureChoices The data to fill the configure choices form.
     * @returns {Object} The created configure choices.
     */
    static configureFirstGroupChoicesSubscriptionProduct(subscriptionName, configureChoices) {
        const subscriptionDetails = Navigator.goToSubscription(subscriptionName);
        const createGroupOfChoicesPage = subscriptionDetails.clickConfigureOptions();
        const productChoicesPage = this.createGroupChoices(createGroupOfChoicesPage, configureChoices.createGroupOfChoices);
        let addedOptionList = this.addProductsToContainer(productChoicesPage, configureChoices.addOptionGroupList);
        configureChoices.addOptionGroupList = addedOptionList;
        productChoicesPage.clickSave();
        return configureChoices;
    }

    /**
     * Creates a Group Choice.
     * @param {CreateGroupOfChoicesPage} createGroupOfChoicesPage
     * @param {Object} createGroupOfChoices the data to fill the Create Group Choices form
     * @returns {ProductChoicesPage} The Product Choices Page.
     */
    static createGroupChoices(createGroupOfChoicesPage, createGroupOfChoices) {
        return createGroupOfChoicesPage.createGroupOfChoices(createGroupOfChoices);
    }

    /**
     * Add products to a container.
     * @param {ProductChoicesPage} productChoicesPage
     * @param {Array<Object>} addOptionGroupList The data to fill in the form add product to container
     * @returns {Array<Object>>} The created data in the form.
     */
    static addProductsToContainer(productChoicesPage, addOptionGroupList) {
        let optionGroupCreatedList = [];
        addOptionGroupList.forEach((addOptionGroup) => {
            const addOptionToGroupPage = productChoicesPage.clickAddChoice();
            let addedOption = addOptionToGroupPage.addChoice(addOptionGroup);
            optionGroupCreatedList.push(addedOption);
        });

        return optionGroupCreatedList;
    }

    /**
     * Delete subscription products which were created adding group choices to a subscription product.
     * The created subscription products are by default created as active so the method has to change them to test
     * and then delete them.
     * Note the method do not delete the existing products in the list.
     * The method retrieves a list of added groups with the products added in the group and iterate over the list to delete
     * all the created products.
     * @param {Array<Object>} addOptionGroupList The list of the product objects added to the group.
     */
    static disableSubscriptionProductOptionGroupList(addOptionGroupList) {
        addOptionGroupList.forEach((optionGroup) =>{
            if ('productName' in optionGroup) {
                let productDetails = Navigator.goToProduct(optionGroup.productName);
                productDetails.setTest();
                this.disableSubscriptionProduct(optionGroup.productName);
            }
        });
    }

    /**
     * Method to duplicate a Subscription
     * @param {String} productName, subscription Name
     * @param {Object} infoForDuplicated, information to duplicate subscription
     * @return {Object} Duplicated subscription
     */
    static duplicateProductSubscription(productName, infoForDuplicated) {
        const subscriptionDetails = Navigator.goToSubscription(productName);
        const duplicateProductPage = subscriptionDetails.clickDuplicate();
        return duplicateProductPage.fillForm(infoForDuplicated);
    }

    /**
     * Creates a File Backup Offer
     * @param {Object} fileBackupOfferInfo The File backup offer data to fill the creation form.
     */
    static createFileBackupOffer(fileBackupOfferInfo) {
        const addFileBackupOfferPage = Navigator.goToCreateFileBackUpOffer();
        addFileBackupOfferPage.fillAddFileBackupOfferForm(fileBackupOfferInfo);
        const fileBackupOfferSettingsPage = addFileBackupOfferPage.clickNext();
        fileBackupOfferSettingsPage.clickSave();
    }

    /**
     * Disable the File Backup Offer
     * @param {string} fileBackupOfferName The name of the File Backup Offer to disable.
     */
    static disableFileBackupOffer(fileBackupOfferName) {
        const fileBackupOfferSettingsPage = Navigator.goToFileBackupOfferStatus(fileBackupOfferName);
        fileBackupOfferSettingsPage.clickDisabled();
    }
    /**
     * Add a price to the subscription.
     * @param {string} subscriptionName The name of the subscription.
     * @param {object} priceData The price data to add.
     */
    static createPriceForProductSubscription(subscriptionName, priceData) {
        const pricesPage = Navigator.goToSubscriptionPricesPage(subscriptionName);
        const createPricePage = pricesPage.clickCreatePrice();
        createPricePage.fillCreateForm(priceData);
        const priceSettingsPage = createPricePage.clickCreate();
        priceSettingsPage.clickSave();
    }

    /**
     * Add a Custom Notification to the Notifications.
     * @param {Object} notificationInfo The information to fill the Custom Notification form.
     */
    static addCustomNotification(notificationInfo) {
        const customNotificationPage = Navigator.goToAddCustomNotificationPage();
        customNotificationPage.fillSetupCustomNotificationForm(notificationInfo);
        const customNotificationConfigurationPage = customNotificationPage.clickNext();
        customNotificationConfigurationPage.clickSave();
    }

    /**
     * Edit a Custom Notification. The method edits the Custom Notification which match with the values 'Status', 'To',
     * 'Name', 'Applies To'
     * @param {string} status The value in the row for the 'Status' column.
     * @param {string} to The value in the row for the 'To' column.
     * @param {string} name The value in the row for the 'Name' column.
     * @param {string} appliesTo The value in the row for the 'Applies To' column.
     * @param {Object} notificationInfo The information to edit the Custom Notification.
     */
    static editCustomNotification(status, to, name, appliesTo, notificationInfo) {
        const customNotificationConfigurationPage = Navigator.goToCustomNotificationPage(status, to, name, appliesTo);
        customNotificationConfigurationPage.fillCustomNotificationForm(notificationInfo);
        customNotificationConfigurationPage.clickSave();
    }

    /**
     * Edit the Default Notification form.
     * @param {Object} notificationInfo The information to edit the Default Notification.
     */
    static editDefaultNotification(notificationInfo) {
        const defaultNotifySettingsPage = Navigator.goToDefaultNotifySettingsPage();
        defaultNotifySettingsPage.fillDefaultNotifySettingsForm(notificationInfo);
        defaultNotifySettingsPage.clickSave();
    }

    /**
     * Delete a Custom Notification. The method deletes the Custom Notification which match with the values 'Status', 'To',
     * 'Name', 'Applies To'
     * @param {string} status The value in the row for the 'Status' column.
     * @param {string} to The value in the row for the 'To' column.
     * @param {string} name The value in the row for the 'Name' column.
     * @param {string} appliesTo The value in the row for the 'Applies To' column.
     * @param {Object} notificationInfo The information to edit the Custom Notification.
     */
    static deleteCustomNotification(status, to, name, appliesTo) {
        const statusPage = Navigator.goToCustomNotificationStatusPage(status, to, name, appliesTo);
        statusPage.clickDeleted();
    }

    /**
     * Method to edit Description and Image of Product
     * @param productName, product name
     * @param descriptionAndImageData, Data for Description and image
     */
    static editSubscriptionAndImageProduct(productName, descriptionAndImageData) {
        const subscriptionDetailsA = Navigator.goToSubscription(productName);
        subscriptionDetailsA.editDescriptionAndImageInfo(descriptionAndImageData);
    }
}

module.exports = ObjectGenie;
