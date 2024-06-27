import { AlbumTheme } from "./AlbumTheme";

export const albumThemes: { [key: string]: AlbumTheme } = {
  'Taylor Swift': {
    backgroundImage: 'url(https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg)',
    overlay: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))'
  },
  'The Tortured Poets Department': {
    backgroundImage: 'url(https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/The+Tortured+Poets+Department.jpeg)',
    overlay: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))'
  },
  'Fearless': {
    backgroundImage: 'url(https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Fearless.jpg)',
    overlay: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))'
  },
  // Add more albums here
};
