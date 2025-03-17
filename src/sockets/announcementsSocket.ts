import { io } from "../index";



io.on("connection", socket => {
  console.log("New client connected");
})




//TODO: have asocket connection between admin and all users which only admin can publish and users can read what is published




