import React from 'react';
import { DataRoot, Child } from '../../types';

type Props = {
  onSelect?: (folderId: DataRoot | Child) => void;
  selected: string;
  path?: string
  file: any
};

const FileItem = ({ file, onSelect, path, selected }:Props) => {
  const handleSelect = () => {
        onSelect && onSelect({...file, path: path || "/"});
  };

  return <div onClick={handleSelect} className={`cursor-pointer pl-2 ${selected === path ? 'text-blue-500' : ''}`}>📄 {file.name}</div>;
};

export default FileItem;
