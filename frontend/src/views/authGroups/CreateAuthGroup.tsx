import React, { useEffect, useState } from 'react';

import { createAuthGroup, readAuthGroups } from '../../client';
import { ReadPaginationFilter2Filters } from '../../pontus-api/typescript-fetch-client-generated';
import AuthGroupForm from './AuthGroupForm';

const CreateAuthGroup = () => {
  const createGroup = async (body: {
    name: string;
    parents: string[];
    symlinks: string[];
  }) => {
    try {
      const res = await createAuthGroup({
        ...body,
        parents: body?.parents?.map((parent) => parent.value),
        symlinks: body?.symlinks?.map((symlink) => symlink.value),
      });

      console.log(res, body);
    } catch (error) {
      console.error(error);
    }
  };

  // Sample options for select components
  //   const parentOptions = [
  //     { value: 'parent1', label: 'Parent 1' },
  //     { value: 'parent2', label: 'Parent 2' },
  //     // Add more options as needed
  //   ];

  return (
    <div className="flex flex-col items-center h-full justify-center">
      <AuthGroupForm onSubmit={createGroup} />
    </div>
  );
};

export default CreateAuthGroup;
