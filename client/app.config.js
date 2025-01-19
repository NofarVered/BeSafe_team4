import dotenv from 'dotenv';
dotenv.config(); 

export default {
  expo: {
    name: "My App",
    slug: "my-app",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],
    extra: {
      apiUrl: process.env.VITE_SERVER_API_URL
    },
    "newArchEnabled": true,

  }
};
