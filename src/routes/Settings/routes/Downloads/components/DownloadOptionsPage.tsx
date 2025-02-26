import * as React from 'react';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = ['allow_slow_overlap', 'finished_remove_exit', 'use_partial_sharing'];

const SegmentsEntry = ['segmented_downloads', 'min_segment_size'];

const BufferEntry = ['socket_read_buffer', 'socket_write_buffer', 'buffer_size'];

const CompressionEntry = ['compress_transfers', 'max_compression'];

const DownloadOptionsPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  const { translate } = moduleT;
  return (
    <div>
      <RemoteSettingForm keys={Entry} />
      <RemoteSettingForm keys={SegmentsEntry} title={translate('Segments')} />
      <RemoteSettingForm keys={CompressionEntry} title={translate('Compression')} />
      <RemoteSettingForm keys={BufferEntry} title={translate('Buffers')} />
    </div>
  );
};

export default DownloadOptionsPage;
