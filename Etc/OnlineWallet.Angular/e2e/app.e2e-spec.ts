import { OnlineWalletClientPage } from './app.po';

describe('online-wallet-client App', () => {
  let page: OnlineWalletClientPage;

  beforeEach(() => {
    page = new OnlineWalletClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
