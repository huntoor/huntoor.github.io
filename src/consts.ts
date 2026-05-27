import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Omar Ahmed (Huntoor)",
  EMAIL: "omarahmed99929@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3, //Limit num of posts on home page.
  NUM_WORKS_ON_HOMEPAGE: 2, //Limit num of works on home page.
  NUM_PROJECTS_ON_HOMEPAGE: 3, //Limit num of projects on home page
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Trying to become a decent security analyst.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles my blogs.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "https://twitter.com/hunt00r",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/huntoor"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/huntoor",
  }
];
