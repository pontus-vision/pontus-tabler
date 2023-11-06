const data = {
  id: 'root',
  name: '/',
  type: 'folder',
  children: [
    {
      id: 'folder 1',
      name: 'Folder 1',
      type: 'folder',
      children: [
        {
          id: 'dashboard 1',
          name: 'Dashboard 1',
          type: 'file',
        },
        {
          id: 'dashboard 2',
          name: 'Dashboard 2',
          type: 'file',
        },
        {
          id: 'folder 2',
          name: 'Folder 2',
          type: 'folder',
          children: [
            {
              id: 'dashboard 3',
              name: 'Dashboard 3',
              type: 'file',
            },
            {
              id: 'dashboard 4',
              name: 'Dashboard 4',
              type: 'file',
            },
          ],
        },
      ],
    },
  ],
};

export default data;
