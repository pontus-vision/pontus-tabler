const data = {
  id: 'root',
  name: 'Root',
  type: 'folder',
  children: [
    {
      id: 'dashboard1',
      name: 'Dashboard 1',
      type: 'folder',
      children: [
        {
          id: 'file1',
          name: 'File 1.txt',
          type: 'file',
        },
      ],
    },
    {
      id: 'dashboard2',
      name: 'Dashboard 2',
      type: 'folder',
      children: [
        {
          id: 'dashboard3',
          name: 'Dashboard 3',
          type: 'folder',
          children: [
            {
              id: 'file2',
              name: 'File 2.txt',
              type: 'file',
            },
          ],
        },
      ],
    },
  ],
};

export default data;
