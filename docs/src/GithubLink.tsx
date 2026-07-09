import React from 'react';
import githubIcon from './images/github.svg';

interface GithubLinkProps {
  link: string;
  text: string;
}

const GithubLink = ({ link, text }: GithubLinkProps) => {
  return (
    <a href={link} className="githubSection">
      <img className="githubIcon" src={githubIcon} alt="github" />
      {text}
    </a>
  );
};

export default GithubLink;
