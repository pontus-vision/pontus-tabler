import React from 'react';
import { DataRoot, Child } from '../../types';
import { MenuItemTreeRef } from '../../pontus-api/typescript-fetch-client-generated';

type Props = {
  onSelect?: (folderId: MenuItemTreeRef) => void;
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
