
# HeatHub

Electronics and electrical equipment store

## Requirements

You can easily install those software:

1. `sudo apt install nodejs`
`sudo apt install npm`

2. Open folders `/backend` and `frontend` in your terminal and run `npm install`

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files
/backend/.env `HTTPS_PORT` `HTTP_PORT` `HTTP_PORT` `JWT_SECRET_KEY` `DB_URL`
/frontend/.env `REACT_APP_API_URL` `REACT_APP_PUBLIC_URL`

## Deployment

To deploy server run
```bash
  npm run dev
```
To deploy frontend run
```bash
  npm start
```

### Here's list of possible user API requests

#### Authorization

| Action | Request / Event | Requirements | Result |
| :- | :-: | :-: | :-: | 
| Register |`POST - /api/auth/register` |json data -> {email, fullName, password} | User registered |
| Login |`POST - /api/auth/login`| json data -> {email, password} | Token with user object returns |
| Logout |`disconnect`| json data -> {id, role} | User logged out |

#### Users

| Action | Request | Requirements | Result |
| :- | :-: | :-: | :-: | 
| Get all users |`GET - /api/users`| Nothing | Show all users |
| Get specified user |`GET - /api/users/:id`| Nothing | Specified user displayed |
| Update user |`PUT - /api/users/:id`| accessToken | User updated |
| User delete |`DELETE - /api/users`| accessToken | User deleted |

#### Chat

| Action | Request | Requirements | Result |
| :- | :-: | :-: | -:| 
|Get all rooms|`GET - /rooms`|accessToken & admin|Rooms returned to admin|
|Get room by id|`GET - /rooms/:roomId`|Nothing|Room returned by id|
|Create like to comment|`GET - /room`|accessToken & customer|Room returned to authorized user holder|
|Send message|`join-room`|Nothing|Join to room|
|Send message|`send-message`|Nothing|Message sent|
|Recieve message|`new-message`|Nothing|Message received|
|Recieve message|`new-room-message`|Nothing|Notifying about new message|
|Recieve message|`leave-room`|Nothing|Leave the room|


#### Items

| Action | Request | Requirements | Result |
| :- | :-: | :-: | -:| 
|Get items|`GET - /api/items/:type`|Nothing|Show specified items |

#### Cart

| Action | Request | Requirements | Result |
| :- | :-: | :-: | -:| 
|Get cart|`GET - /api/cart`|accessToken|Show cart items|
|Update cart|`PUT - /api/cart`|accessToken|Cart updated|
