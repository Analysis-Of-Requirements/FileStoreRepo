import GetFileContentAction from '../../../app/actions/get-file-content-action.js';
import AddFileToDownloadingInProgressMutator
  from '../../../app/mutators/add-file-to-downloading-in-progress-mutator.js';
import RemoveFileFromDownloadingInProgressMutator
  from '../../../app/mutators/remove-file-from-downloading-in-progress-mutator.js';
import FileDownloadingIssueMutator from '../../../app/mutators/file-downloading-issue-mutator.js';

const {module, test} = QUnit;

export default module('Get File Content Action', () => {

  test('should call correct mutators and apiService methods for successful response.', async (assert) => {
    assert.expect(7);

    const file = {
      id: 'file-mock-id',
      name: 'file-mock-name',
    };

    const stateManager = {
      apiService: {
        async getFileContent(id) {
          assert.step(`Should call ApiService.getFileContent() with passed file id: ${id}.`);
          return new Blob();
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddFileToDownloadingInProgressMutator) {
          assert.step(`${mutator.constructor.name}.file.id: ${mutator._file.id}.`);
        } else if (mutator instanceof RemoveFileFromDownloadingInProgressMutator) {
          assert.step(`${mutator.constructor.name}.file.id: ${mutator._file.id}.`);
        }
      },
    };

    const fileDownloader = {
      downloadFile(file) {
        assert.step(`Should pass file.name: ${file.name}.`);
      },
    };

    const action = new GetFileContentAction(file, fileDownloader);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${AddFileToDownloadingInProgressMutator.name}.`,
      `${AddFileToDownloadingInProgressMutator.name}.file.id: ${file.id}.`,
      `Should call ApiService.getFileContent() with passed file id: ${file.id}.`,
      `Should pass file.name: ${file.name}.`,
      `Called mutator: ${RemoveFileFromDownloadingInProgressMutator.name}.`,
      `${RemoveFileFromDownloadingInProgressMutator.name}.file.id: ${file.id}.`,
    ], 'Necessary mutators and ApiService methods were called in correct order.');
  });

  test('should call correct mutators and apiService methods for failed response.', async (assert) => {
    assert.expect(8);

    const file = {
      id: 'file-mock-id',
    };

    const errorMessage = 'error-message';

    const stateManager = {
      apiService: {
        async getFileContent(id) {
          assert.step(`Should call ApiService.getFileContent() with passed file id: ${id}.`);
          throw new Error(errorMessage);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddFileToDownloadingInProgressMutator) {
          assert.step(`${mutator.constructor.name}.file.id: ${mutator._file.id}.`);
        } else if (mutator instanceof RemoveFileFromDownloadingInProgressMutator) {
          assert.step(`${mutator.constructor.name}.file.id: ${mutator._file.id}.`);
        } else if (mutator instanceof FileDownloadingIssueMutator) {
          assert.step(`${mutator.constructor.name}.error.message: ${mutator._error.message}, file.id: ${mutator._file.id}.`);
        }
      },
    };

    const action = new GetFileContentAction(file, {});
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${AddFileToDownloadingInProgressMutator.name}.`,
      `${AddFileToDownloadingInProgressMutator.name}.file.id: ${file.id}.`,
      `Should call ApiService.getFileContent() with passed file id: ${file.id}.`,
      `Called mutator: ${FileDownloadingIssueMutator.name}.`,
      `${FileDownloadingIssueMutator.name}.error.message: ${errorMessage}, file.id: ${file.id}.`,
      `Called mutator: ${RemoveFileFromDownloadingInProgressMutator.name}.`,
      `${RemoveFileFromDownloadingInProgressMutator.name}.file.id: ${file.id}.`,
    ], 'Necessary mutators and ApiService methods were called in correct order.');
  });
});
