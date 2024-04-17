// ProjectContext.js
import React, { createContext, useState } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);

  return (
    <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => React.useContext(ProjectContext);
