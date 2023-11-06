import React from 'react';
import { DataRoot, Child } from '../../types';

type Props = {
  onSelect?: (folderId: DataRoot | Child) => void;
  selected: string;
  path?: string;
  file: any;
  actionsMode: boolean;
};

const FileItem = (props: Props) => {
  const handleSelect = () => {
    props.onSelect &&
      props.onSelect({ ...props.file, path: props.path || '/' });
  };

  return (
    <div
      onClick={handleSelect}
      className={`cursor-pointer pl-2 ${
        props.selected === props.path ? 'text-blue-500' : ''
      }`}
    >
      📄 {props.file.name}
    </div>
  );
};

export default FileItem;
