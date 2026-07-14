import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Projects } from './pages/projects/projects';
import { Skills } from './pages/skills/skills';
import { Experience } from './pages/experience/experience';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'about',
    component: About
  },
  {
    path: 'projects',
    component: Projects
  },
  {
    path: 'skills',
    component: Skills
  },
  {
    path: 'experience',
    component: Experience
  },
  {
    path: 'contact',
    component: Contact
  }
];