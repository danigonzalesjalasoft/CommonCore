'use strict';

const Common = require('./common.js');
const Login = require('../../../pageobjects/classic/loginPage.js');
const MenuBar = require('../menu/menuBar.js');
const StoreHome = require('../storeHomePage.js');
const Store = require('../stores/storePage.js');
const ProductChoicesPage = require('../container/productChoicesGroup/productChoicesPage.js');
const StoreUtil = require('../../../utils/store/storeUtil.js');

/**
 * The class models the NavigatorPage page.
 */
class NavigatorPage {
    /**
     * Navigate to principal Home.
     */
    static goToHome() {
        browser.refresh();
        new MenuBar().clickHome();
    }

    /**
     * Navigate to HomeStore.
     */
    static goToStoreHome(storeName = StoreUtil.getStoreName()) {
        const store = new Store();
        Common.waitUntil(() => {
            this.goBaseUrl();
            return store.isStoreExisting(storeName);
        }, `The store: ${storeName} is not existing.` );

        // Click on the store until the store is opened.
        Common.waitUntil(() => {
            if (store.isStoreExisting(storeName)) {
                store.clickSpecificStore(storeName);
                return !store.isStoreExisting(storeName);
            } else {
                return true;
            }
        }, `It was not possible to go to the store: ${storeName}` );
    }

    /**
     * Navigate to create Subscription
     * @returns {CreateSubscriptionPage}
     */
    static goToCreateSubscription() {
        let productsAndPages;
        this.goToHome();
        productsAndPages = new StoreHome().clickProductPage();
        return productsAndPages.clickCreateSubscription();
    }

    /**
     * Navigate to Store settings admin tab Section.
     * @returns {AdminPage} The Admin Page.
     */
    static gotToStoreSettingsAdminTab() {
        const storeHome = new StoreHome();
        const storeSettings = storeHome.clickStoreSettings();
        return storeSettings.clickAdminTab();
    }

    /**
     * Navigate to create Product.
     * @returns {CreateProductPage} create product page.
     */
    static goToCreateProduct() {
        let productsAndPages;
        this.goToHome();
        productsAndPages = new StoreHome().clickProductPage();
        return productsAndPages.clickCreateProduct();
    }

    /**
     * Go to ProductsAndPages.
     */
    static goToProductsAndPages() {
        this.goToHome();
        return new StoreHome().clickProductPage();
    }

    /**
     * Go to Specific Subscription.
     * @returns {ProductsAndPagesPage}
     */
    static goToSubscription(subscriptionName) {
        let productsAndPages, productDetails;
        this.goToHome();
        productsAndPages = new StoreHome().clickProductPage();
        if (productsAndPages.existSubscription(subscriptionName)) {
            productDetails = productsAndPages.clickSpecificSubscription(subscriptionName);
            productDetails.waitForDisplay();
            return productDetails;
        }
    }

    /**
     * Go to Specific Product.
     * @returns {ProductDetailsPage}
     */
    static goToProduct(productName) {
        let productsAndPages;
        this.goToHome();
        productsAndPages = new StoreHome().clickProductPage();
        if (productsAndPages.existProduct(productName)) {
            return productsAndPages.clickSpecificProduct(productName);
        }
    }

    /**
     * Go to store and select specific product.
     * @param {string} productName is the name of product.
     * @returns {StoreTestingClassicPage}
     */
    static goToStoreProduct(productName) {
        let productsAndPages, productDetails;
        this.goToHome();
        productsAndPages = new StoreHome().clickProductPage();
        if (productsAndPages.existProduct(productName.name)) {
            productDetails = productsAndPages.clickSpecificProduct(productName.name);
            productDetails.waitForDisplay();
            return new MenuBar().clickOpenStoreTest();
        }
        throw new Error(`No exist the product: ${productName.name}`);
    }

    /**
     * Go to StoreSubscription.
     * @returns {StoreTestingClassicPage}
     */
    static goToStoreSubscription(subscriptionName) {
        let productsAndPages, productDetails;
        this.goToHome();
        productsAndPages = new StoreHome().clickProductPage();
        if (productsAndPages.existSubscription(subscriptionName.name)) {
            productDetails = productsAndPages.clickSpecificSubscription(subscriptionName.name);
            productDetails.waitForDisplay();
            return new MenuBar().clickOpenStoreTest();
        } else {
            throw new Error(`No exist the product/subscription: ${subscriptionName.name}`);
        }
    }

    /**
     * Go to search order.
     * @param orderId
     * @returns {OrderDetailsPage}
     */
    static goToOrderSearch(orderId) {
        this.goToHome();
        return new StoreHome().searchOrderId(orderId);
    }

    /**
     * go to last order created, the first in the list.
     * @return {ViewSubscriptionPage}
     */
    static goToLastOrderCreated() {
        this.goToHome();
        const reportsPage = new MenuBar().clickReports();
        const recentReports = reportsPage.clickViewRecentOrders();
        const orderDetails = recentReports.clickFirstOrder();
        return orderDetails.clickViewSubscription();
    }

    /**
     * Go to the Add Fulfillment Action page for an specific subscription.
     * @param {string} subscriptionName The subscription name to add a fulfillment action.
     * @returns {AddFulfillmentActionPage} The add fulfillment action page.
     */
    static goToAddFulfillmentActionForSubscription(subscriptionName) {
        return this.goToSubscription(subscriptionName).clickAddFulfillment();
    }

    /**
     * Go to the Order Creator page
     * @returns {OrderCreator} The Order Creator Page.
     */
    static goToOrderCreator() {
        this.goToHome();
        return new StoreHome().clickOrderCreator();
    }

    /**
     * Navigate to create Container Page.
     * @returns {CreateContainerPage}
     */
    static goToCreateContainerPage() {
        this.goToHome();
        const productsAndPages = new StoreHome().clickProductPage();
        return productsAndPages.clickCreateContainerPage();
    }

    /**
     * Go to Specific Container Page.
     * @returns {ContainerDetailPage}
     */
    static goToContainerPage(containerPageName) {
        let productsAndPages;
        this.goToHome();
        productsAndPages = new StoreHome().clickProductPage();
        if (productsAndPages.existProduct(containerPageName)) {
            return productsAndPages.clickSpecificContainerPage(containerPageName);
        }
        throw new Error(`No exist container Page: ${containerPageName}`);
    }

    /**
     * Method to go create Cross sell offer
     * @returns {CreateCrossSellPage}
     */
    static goToCreateCrossSell() {
        this.goToHome();
        let offersPage = new StoreHome().clickOffers();
        return offersPage.clickCreateCrossSell();
    }

    /**
     * Method to go selected Offer
     * @param {string} offerName, Offer name
     * @returns {OfferDetailsPage}
     */
    static goToOffer(offerName) {
        this.goToHome();
        let offersPage = new StoreHome().clickOffers();
        return offersPage.clickSpecificOffer(offerName);
    }

    /**
     * Go to create template page.
     * @return {CreateTemplatePage}, instance
     */
    static goToCreateTemplatePage() {
        this.goToHome();
        const productAndPages = new StoreHome().clickProductPage();
        return productAndPages.clickCreateTemplatePage();
    }

    /**
     * Go to Specific Template page name.
     * @param {string} templatePageName
     * @return {TemplatePageDetailPage}, instance
     */
    static goToTemplatePage(templatePageName) {
        this.goToHome();
        const productsAndPages = new StoreHome().clickProductPage();
        if (productsAndPages.existProduct(templatePageName)) {
            return productsAndPages.clickSpecificTemplatePage(templatePageName);
        }
        throw new Error(`No exist template Page: ${templatePageName}`);
    }

    /**
     * Method to go create Coupon offer
     * @returns {CreateDiscountPage}
     */
    static goToCreateCoupon() {
        this.goToHome();
        let offersPage = new StoreHome().clickOffers();
        return offersPage.clickCreateDiscount();
    }

    /**
     * Go to the base URL configured in the wdio.conf file.
     */
    static goBaseUrl() {
        browser.url('/');
    }

    /**
     * If the Order wizard is opened, the method close it.
     */
    static closeOrderWizard() {
        const handles = Common.getWindowHandles();
        if (handles.length > 1) {
            Common.switchToWindow(handles[1]);
            Common.closeBrowser();
        }
    }

    /**
     * Method to create a new Selenium session with your current capabilities.
     * This is useful if you test highly stateful application where you need to clean the browser session.
     */
    static reloadBrowserSession() {
        browser.reloadSession();
    }

    /**
     * Method to go to Offer Page
     * @returns {OffersPage}, instance
     */
    static goToOffersPage() {
        this.goToHome();
        return new StoreHome().clickOffers();
    }

    /**
     * Go to the product choices page.
     * @param {string} subscriptionName The name of the subscription to open its configure options.
     * @returns {ProductChoicesPage}  The Product Choices Page.
     */
    static goToSupscriptionProductChoices(subscriptionName) {
        const productDetails = this.goToSubscription(subscriptionName);
        productDetails.clickConfigureOptions();
        return new ProductChoicesPage();
    }

    /**
     * Go to the Product Subscription status page.
     * @param {string} subscriptionName The name of the subscription to open its status page.
     * @returns {ProductStatusPage} The status page.
     */
    static goToSubscriptionStatusPage(subscriptionName) {
        const productDetails = this.goToSubscription(subscriptionName);
        return productDetails.clickStatus();
    }

    /**
     * Go to the Offer page and click the Create File Backup Offer
     * @returns {AddFileBackupOfferPage} The Add File Backup Offer page.
     */
    static goToCreateFileBackUpOffer() {
        const offersPage = this.goToOffersPage();
        return offersPage.clickCreateFileBackupOffer();
    }

    /**
     * Go to the File Backup Offer Name
     * @param {string} fileBackupOfferName The name of the File Backup to open.
     * @returns {FileBackupOfferSettingsPage} The AddFileBackupOfferPage instance.
     */
    static goToFileBackupOffer(fileBackupOfferName) {
        const offersPage = this.goToOffersPage();
        return offersPage.clickSpecificFileBackupOffer(fileBackupOfferName);
    }

    /**
     * Go to the File Backup Offer Name status page
     * @param {string} fileBackupOfferName The name of the File Backup to open.
     * @returns {FileBackupOfferStatusPage} The FileBackupOfferStatusPage instance.
     */
    static goToFileBackupOfferStatus(fileBackupOfferName) {
        const fileBackupOfferSettingsPage = this.goToFileBackupOffer(fileBackupOfferName);
        return fileBackupOfferSettingsPage.clickStatus();
    }

    /**
     * Go to the Product Subscription prices page.
     * @param {string} subscriptionName The name of the subscription to open its prices page.
     * @returns {PricesPage} The Prices page.
     */
    static goToSubscriptionPricesPage(subscriptionName) {
        const subscriptionPage = this.goToSubscription(subscriptionName);
        return subscriptionPage.clickEditPrice();
    }

    /**
     * Go to the Notify Settings Page.
     * @returns {NotifySettingsPage} The Notify Settings Page instance.
     */
    static goToNotifySettingsPage() {
        this.goToHome();
        return new MenuBar().clickNotifications();
    }

    /**
     * Go to the Add Custom Notification Page.
     * @returns {CustomNotificationPage} The Custom Notification Page instance.
     */
    static goToAddCustomNotificationPage() {
        const notifySettingsPage = this.goToNotifySettingsPage();
        return notifySettingsPage.clickAdd();
    }

    /**
     * Go to the Default Notify Settings Page.
     * @returns {DefaultNotifySettingsPage} The Default Notify Settings Page instance.
     */
    static goToDefaultNotifySettingsPage() {
        const notifySettingsPage = this.goToNotifySettingsPage();
        return notifySettingsPage.clickEdit();
    }

    /**
     * Go to an specific custom notification configuration page.
     * @param {string} status The value in the row for the 'Status' column.
     * @param {string} to The value in the row for the 'To' column.
     * @param {string} name The value in the row for the 'Name' column.
     * @param {string} appliesTo The value in the row for the 'Applies To' column.
     * @returns {CustomNotificationConfigurationPage} The Custom Notification Configuration Page instance.
     */
    static goToCustomNotificationPage(status, to, name, appliesTo) {
        const notifySettingsPage = this.goToNotifySettingsPage();
        return notifySettingsPage.clickCustomNotification(status, to, name, appliesTo);
    }

    /**
     * Go to the staus page of an specific custom notification configuration..
     * @param {string} status The value in the row for the 'Status' column.
     * @param {string} to The value in the row for the 'To' column.
     * @param {string} name The value in the row for the 'Name' column.
     * @param {string} appliesTo The value in the row for the 'Applies To' column.
     * @returns {StatusPage} The Status Page instance.
     */
    static goToCustomNotificationStatusPage(status, to, name, appliesTo) {
        const customNotificationConfigurationPage = this.goToCustomNotificationPage(status, to, name, appliesTo);
        return customNotificationConfigurationPage.clickStatus();
    }

    /**
     * Method to login to portal
     * @param {Object} credentials, information with the credentials
     * @param {String} companyID, optional company
     */
    static loginPortal(credentials, companyID = null) {
        let updatedCredentials = credentials;
        if (companyID !== null) {
            updatedCredentials = Object.assign({}, credentials);
            updatedCredentials.company = companyID;
        }
        const login = new Login();
        login.open();
        login.loginToSpringBoard(updatedCredentials);
    }
}

module.exports = NavigatorPage;
