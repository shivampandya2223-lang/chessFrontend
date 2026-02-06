# Multiplayer Socket System Documentation

## Overview
This chess application now includes a real-time multiplayer system using Socket.io. Users can see who's online, send game requests, and play against each other in real-time.

## Features

### 1. **Online User Presence**
- Shows all online users in real-time
- Green indicator on the group icon when connected
- Automatic updates when users connect/disconnect

### 2. **Game Request System**
- Send game challenges to online players
- Receive notifications for incoming game requests
- Red notification badge on the group icon shows pending requests
- Accept or reject incoming requests
- Cancel sent requests

### 3. **Game Room Management**
- Automatic room creation when a request is accepted
- Room contains both players' information
- Ready for real-time game synchronization

## User Interface

### Navbar Components

#### **Group Icon (RiGroupFill)**
- **Green dot**: Socket connected
- **Gray dot**: Socket disconnected
- **Red badge with number**: Pending game requests

#### **Click Behavior**
- If you have pending requests → Opens requests dropdown
- If no requests → Opens online users modal

### Game Requests Dropdown
- Shows all incoming game requests
- Each request displays:
  - Sender's username
  - Accept button (green)
  - Reject button (red)
- "View All Players" button to see online users

### Online Users Modal
- Lists all online players (except yourself)
- Each player shows:
  - Avatar with first letter of username
  - Username
  - Online status (green dot)
  - Challenge button
- Can cancel sent requests

## Socket Events

### Connection Events
- `connect` - Socket connected successfully
- `disconnect` - Socket disconnected
- `error` - Socket error occurred

### User Presence Events
- `online:users` - Receive list of all online users
- `user:connected` - A user came online
- `user:disconnected` - A user went offline

### Game Request Events
- `game:request:send` - Send a game request
- `game:request:received` - Receive a game request
- `game:request:accept` - Accept a game request
- `game:request:reject` - Reject a game request
- `game:request:cancel` - Cancel a sent request

### Game Room Events
- `room:created` - Room created successfully
- `room:joined` - Joined a game room
- `room:left` - Left a game room
- `game:start` - Game started

### Game Play Events
- `game:move` - Send a move
- `game:move:made` - Move was made by opponent
- `game:over` - Game ended

## State Management

### Socket Store (`socketStore.ts`)
Manages all socket-related state:
- `isConnected`: Socket connection status
- `onlineUsers`: Array of online users
- `gameRequests`: Incoming game requests
- `sentRequests`: Outgoing game requests
- `currentRoom`: Current game room information

### Actions
- `setConnected(boolean)`: Update connection status
- `setOnlineUsers(users[])`: Update online users list
- `addGameRequest(request)`: Add incoming request
- `removeGameRequest(requestId)`: Remove request
- `addSentRequest(request)`: Track sent request
- `removeSentRequest(requestId)`: Remove sent request
- `setCurrentRoom(room)`: Set current game room
- `clearRequests()`: Clear all requests

## Backend Requirements

Your backend should implement these socket events:

### On Connection
```javascript
socket.on('connection', (socket) => {
  // Get user info from socket.handshake.auth
  const { userId, username, token } = socket.handshake.auth;
  
  // Verify token and associate socket with user
  // Broadcast user:connected to other users
  // Send online:users list to the new user
});
```

### Game Request Flow
```javascript
// 1. User A sends request to User B
socket.on('game:request:send', (data) => {
  // Create request with unique ID
  // Emit 'game:request:received' to User B
  // Store request in memory/database
});

// 2. User B accepts request
socket.on('game:request:accept', (requestId) => {
  // Create game room
  // Emit 'room:created' to both users
  // Emit 'game:start' to both users
  // Remove request from pending
});

// 3. User B rejects request
socket.on('game:request:reject', (requestId) => {
  // Emit rejection to User A
  // Remove request from pending
});
```

### Expected Data Structures

#### GameRequest
```typescript
{
  requestId: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  createdAt: string;
}
```

#### GameRoom
```typescript
{
  roomId: string;
  creatorId: string;
  creatorUsername: string;
  opponentId: string;
  opponentUsername: string;
  status: "waiting" | "active" | "finished";
}
```

#### OnlineUser
```typescript
{
  userId: string;
  username: string;
  isOnline: boolean;
}
```

## Usage Example

### Sending a Game Request
```typescript
import { socketActions } from '../socket/socketActions';

// Send request to a user
socketActions.sendGameRequest(userId, username);
```

### Accepting a Request
```typescript
import { socket } from '../socket/socket';
import { SOCKET_EVENT } from '../socket/event';

socket.emit(SOCKET_EVENT.ACCEPT_GAME_REQUEST, requestId);
```

### Accessing Socket State
```typescript
import { useSocketStore } from '../store/socketStore';

const MyComponent = () => {
  const { gameRequests, onlineUsers, isConnected } = useSocketStore();
  
  return (
    <div>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Online Users: {onlineUsers.length}</p>
      <p>Pending Requests: {gameRequests.length}</p>
    </div>
  );
};
```

## Testing

1. **Start your backend** on `http://localhost:3001`
2. **Login with two different users** in separate browser windows
3. **Check connection status** - green dot on group icon
4. **Click group icon** - should show online users modal
5. **Send a challenge** - click "Challenge" button
6. **Check notifications** - red badge should appear on receiver's group icon
7. **Accept/Reject** - test both flows
8. **Check console** - all socket events are logged with emojis

## Socket URL Configuration

Update the socket URL in `/src/socket/socket.ts`:
```typescript
const SOCKET_URL = "http://localhost:3001"; // Change to your backend URL
```

For production, use environment variables:
```typescript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
```

## Next Steps

1. **Integrate with Game Logic**: Connect the game room to the chess game state
2. **Real-time Moves**: Sync chess moves between players
3. **Game Timer**: Add time controls for each player
4. **Chat System**: Add in-game chat
5. **Game History**: Save completed games
6. **Spectator Mode**: Allow users to watch ongoing games
7. **Matchmaking**: Automatic opponent matching
8. **Rating System**: ELO-based player ratings

## Troubleshooting

### Socket Not Connecting
- Check if backend is running on correct port
- Verify CORS settings on backend
- Check browser console for errors
- Ensure token is valid in localStorage

### Requests Not Showing
- Check socket connection status
- Verify backend is emitting events correctly
- Check browser console for socket event logs
- Ensure userId and username are in localStorage

### Users Not Appearing Online
- Verify backend broadcasts `online:users` on connection
- Check if backend tracks connected users
- Ensure socket auth includes userId and username
