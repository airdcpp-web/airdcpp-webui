export const ViewedFileTextLongResponse = {
  content_ready: true,
  download_state: {
    id: 'downloaded',
    str: 'Downloaded',
    time_finished: 1751995300,
  },
  id: '2IYC57IVI532ETITYHT45RS4VRZRFQMX7GPW4XI',
  mime_type: 'text/plain',
  name: 'textfile.txt',
  read: false,
  text: true,
  time_opened: 1751995300,
  tth: '2IYC57IVI532ETITYHT45RS4VRZRFQMX7GPW4XI',
  type: {
    content_type: 'document',
    id: 'file',
    str: 'txt',
  },
};

export const ViewedFileNfoResponse = {
  content_ready: true,
  download_state: {
    id: 'downloaded',
    str: 'Downloaded',
    time_finished: 1751993180,
  },
  id: 'A3YJ26H6DYCPE6XXWMMROXFXIK2UIRBINJZ66XI',
  mime_type: 'text/x-nfo',
  name: 'test.nfo',
  read: false,
  text: true,
  time_opened: 1751993180,
  tth: 'A3YJ26H6DYCPE6XXWMMROXFXIK2UIRBINJZ66XI',
  type: {
    content_type: 'document',
    id: 'file',
    str: 'nfo',
  },
};

export const ViewedFilePendingResponse = {
  content_ready: false,
  download_state: {
    id: 'download_pending',
    str: 'Download pending',
    time_finished: 0,
  },
  id: 'ICR2MN35WXPS2PBUX5KBYRZVVNQ25677MX36G7Q',
  mime_type: 'text/plain',
  name: 'CMakeLists-pending.txt',
  read: true,
  text: true,
  time_opened: 1751995455,
  tth: 'ICR2MN35WXPS2PBUX5KBYRZVVNQ25677MX36G7Q',
  type: {
    content_type: 'document',
    id: 'file',
    str: 'txt',
  },
};

export const ViewedFilesListResponse = [
  ViewedFileTextLongResponse,
  ViewedFileNfoResponse,
  ViewedFilePendingResponse,
];
