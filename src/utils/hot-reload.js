// background.js
let socket = null;

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'hotReload') {
    socket = port;
  }
});

const reload = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
    }
    chrome.runtime.reload();
  });
};

const watchChanges = async dir => {
  const files = await getFilesInDirectory(dir);
  const timestamp = getTimestampForFiles(files);
  console.log(timestamp, 'timestamp');
  setInterval(async () => {
    const newFiles = await getFilesInDirectory(dir);
    const newTimestamp = getTimestampForFiles(newFiles);

    if (newTimestamp !== timestamp) {
      timestamp = newTimestamp;
      reload();
    }
  }, 1000);
};

const getFilesInDirectory = dir =>
  new Promise(resolve =>
    dir.createReader().readEntries(entries => {
      Promise.all(
        entries
          .filter(e => e.name[0] !== '.')
          .map(e =>
            e.isDirectory ? getFilesInDirectory(e) : new Promise(resolve => e.file(resolve))
          )
      )
        .then(files => [].concat(...files))
        .then(resolve);
    })
  );

const getTimestampForFiles = files =>
  files.map(f => f.name + f.lastModifiedDate).join();

const hotReload = () => {
  chrome.management.getSelf(self => {
    if (self.installType === 'development') {
      chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
    }
  });
};
export default hotReload;
