import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = ['allow_slow_overlap', 'finished_remove_exit', 'use_partial_sharing'];

const SegmentsEntry = ['segmented_downloads', 'min_segment_size'];

const BufferEntry = ['socket_read_buffer', 'socket_write_buffer', 'buffer_size'];

const CompressionEntry = ['compress_transfers', 'max_compression'];

const DownloadOptionsPage: React.FC<SettingSectionChildProps> = (props) => {
  const { translate } = props.moduleT;
  return (
    <div>
      <RemoteSettingForm {...props} keys={Entry} />
      <RemoteSettingForm {...props} keys={SegmentsEntry} title={translate('Segments')} />
      <RemoteSettingForm
        {...props}
        keys={CompressionEntry}
        title={translate('Compression')}
      />
      <RemoteSettingForm {...props} keys={BufferEntry} title={translate('Buffers')} />
    </div>
  );
};

export default DownloadOptionsPage;
