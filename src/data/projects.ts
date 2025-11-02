export interface ProjectBase {
  id: string;
  image: string;
  liveLink: string | null;
  githubLink: string;
  pinned: boolean;
}

export const projectsData: ProjectBase[] = [
  {
    id: 'gghub',
    image: 'gghub-placeholder.png',
    liveLink: 'https://gghub.social',
    githubLink: 'https://github.com/AhmetDemiroglu/GGHub',
    pinned: true,
  },
  {
    id: 'rent_a_car',
    image: 'Rent A Car Svg.svg',
    liveLink: null,
    githubLink: 'https://github.com/AhmetDemiroglu/rota-rent-a-car',
    pinned: false,
  },
  {
    id: 'butce_360',
    image: 'butce360 svg.svg',
    liveLink: 'https://expense-tracker-1dc73.firebaseapp.com/',
    githubLink: 'https://github.com/AhmetDemiroglu/expense-tracker',
    pinned: false,
  },
  {
    id: 'not_defteri',
    image: 'Not Defteri svg.svg',
    liveLink: 'https://interactive-notebook-4b92a.web.app/folder/-OHERE6EyPnNkjYdwwwk',
    githubLink: 'https://github.com/AhmetDemiroglu/interactive-notebook',
    pinned: false,
  },
  {
    id: 'simon_game',
    image: 'responsive simon gif.gif',
    liveLink: 'https://ahmetdemiroglu.github.io/Simon/',
    githubLink: 'https://github.com/AhmetDemiroglu/Simon',
    pinned: false,
  },
];