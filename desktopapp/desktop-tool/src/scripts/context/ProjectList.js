// ProjectList.js
import React from 'react';
import { useProject } from './ProjectContext';

const ProjectList = ({ projects }) => {
  const { setCurrentProject } = useProject();

  const handleProjectClick = (projectId) => {
    setCurrentProject(projectId);
    // Navigate to project view
  };

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id} onClick={() => handleProjectClick(project.id)}>
          {project.name}
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
