import Component from './components/component.js';
import NotFoundPage from './pages/not-found-page.js';
import LoginPage from './pages/login-page.js';
import RegistrationPage from './pages/registration-page.js';
import ApiService from './services/api-service.js';
import TitleService from './services/title-service.js';
import FileListExplorer from './pages/file-list-explorer.js';
import StateManager from './state/state-manager.js';
import State from './state/state.js';
import TokenService from './services/token-service.js';
import RouteChangedAction from './actions/route-changed-action.js';
import serverMock from './mocks/server-mock.js';
import Router from './router.js';
import SelectFileService from './services/select-file-service.js';
import BrowserFileDownloader from "./services/browser-file-downloader.js";
import ToastService from './services/toast-service.js';

/**
 * Enumeration of possible url templates.
 *
 * @type {Readonly<{LOGIN: string, REGISTRATION: string}>}
 */
const UrlTemplates = Object.freeze({
  LOGIN: '/login',
  REGISTRATION: '/registration',
  FOLDER: '/folder/:folderId',
});

/**
 * Component for rendering application container.
 */
export default class Application extends Component {

  /**
   * Instantiates Component.
   *
   * @param {HTMLElement} container - app container.
   * @param {object} parameters - application parameters.
   * @param {boolean} parameters.devMode - if true - turn on development tools.
   */
  constructor(container, {devMode = false} = {}) {
    super(container, {devMode});
  }

  /**
   * @inheritdoc
   * @return {string} html markup of application element.
   */
  markup() {
    return `
      <div class="application" data-test="app"></div>
    `;
  }

  /**
   * Initializes nested components of Application component, e.g. form.
   * @inheritdoc
   */
  initNestedComponents() {

    if (this.properties.devMode) {
      serverMock.run();
    }

    const {rootElement} = this;
    const {LOGIN, REGISTRATION, FOLDER} = UrlTemplates;
    const tokenService = new TokenService(window.localStorage);
    const apiService = new ApiService(tokenService);
    const initialState = new State();
    const stateManager = new StateManager(initialState, {apiService});
    const titleService = new TitleService(document);
    const selectFileService = new SelectFileService();
    const fileDownloader = new BrowserFileDownloader();
    const toastService = new ToastService();

    const pageCreators = {
      [LOGIN]: (router) => new LoginPage(
        rootElement, {
          successfulLoginHandler: () => router.redirectTo('/folder'),
          titleService,
          apiService,
        },
      ),
      [REGISTRATION]: (router) => new RegistrationPage(
        rootElement, {
          successfulRegistrationHandler: () => router.redirectTo('/folder'),
          titleService,
          apiService,
        },
      ),
      [FOLDER]: (router) => {
        const listExplorer = new FileListExplorer(rootElement, stateManager, {
          titleService,
          selectFileService,
          fileDownloader,
          toastService,
        });
        listExplorer.onResourceNotFoundError((resourceName, linkToFollow) => {
          router.renderNotFoundPage(resourceName, linkToFollow);
        });
        listExplorer.onAuthenticationError(() => router.redirectTo(LOGIN));
        listExplorer.addRedirectToFolderCallback((itemId) => router.redirectTo(`/folder/${itemId}`));

        return listExplorer;
      },
    };

    Router.getBuilder()
      .withWindow(window)
      .withPageContainer(rootElement)
      .withPageMappings(pageCreators)
      .withDefaultUrlHash(LOGIN)
      .withNotFoundPageCreator((resourceName, linkToFollow) => {
        return new NotFoundPage(rootElement, {resourceName, linkToFollow, titleService});
      })
      .withHashChangeHandler((staticPart, dynamicPart) => {
        stateManager.dispatchAction(new RouteChangedAction(staticPart, dynamicPart));
      })
      .build();
  }
}
