import React from 'react';
import './nav.css';
import GitHubLogo from './imgs/GitHub.png';


const Nav = () => {
  return (
    <nav className="navbar">
<div className="nav-titulo">
  <p className='titulo'>Fu<span className="ti">TI</span>bol</p>
</div>
      <div className="nav-logos">
        <a href="https://github.com/Duduenri/API-Futebol" target="_blank" rel="noopener noreferrer">
          <img src={GitHubLogo} alt="GitHub" className="nav-icon" />
        </a>
      </div>
    </nav>
  );
};

export default Nav;