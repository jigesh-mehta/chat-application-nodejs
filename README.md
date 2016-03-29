# chat-application-nodejs

Developed a chat application for any number of users with following functionalities:
* User can choose custom username or use the given username
* All the connected users are able to see who are online and are currently using the chat application
* Users gets notified when someone enters or leaves the chat application
* The chat history is persistent and any newly connected user can view previous chat history

### How to Run

Clone the repository and run the following command:
'''
		npm install
		node .
'''

(Note: Redis must be installed to run this application.)

Open a web browser and go to http://localhost:8080

Technologies used: Node.js, Express.js, Socket.io, Redis