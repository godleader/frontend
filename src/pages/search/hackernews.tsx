import React from 'react';

// Define the type for a single story
interface Story {
  objectID: string;
  url: string;
  title: string;
  author: string;
  points: number;
}

// Define the props for the component
interface HackerNewsStoriesProps {
  stories?: Story[];
}

const HackerNewsStories: React.FC<HackerNewsStoriesProps> = ({ stories = [] }) => {
  return (
    <div className="stories-wrapper">
      {stories &&
        stories.map(({ objectID, url, title, author, points }) => (
          title &&
          url && (
            <div className="stories-list" key={objectID}>
              <h3>
                <a href={url} target="_blank" rel="noreferrer">
                  {title}
                </a>{' '}
                - By <b>{author}</b> ({points} points)
              </h3>
            </div>
          )
        ))}
    </div>
  );
};

export default HackerNewsStories;