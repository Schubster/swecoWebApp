// ProjectView.js
import React, { useEffect } from 'react';
import { useProject } from './ProjectContext';

const ProjectView = () => {
  const { currentProject } = useProject();

  useEffect(() => {
    // Fetch project data based on currentProject
    console.log('Current project ID:', currentProject);
  }, [currentProject]);

  return <div>{/* Display project details */}</div>;
};

export default ProjectView;
