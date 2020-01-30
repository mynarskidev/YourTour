import { browser, by, element, ElementFinder, ElementArrayFinder } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('h1')).getText() as Promise<string>;
  }
  
   getLoginButton(): ElementFinder {
    return element(by.css('[routerlink="/login"]'));
  }

  getSignupButton(): ElementFinder {
    return element(by.css('[routerlink="/signup"]'));
}