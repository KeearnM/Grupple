# Grupple

## Description

Grupple is group buy management app that allows users to easily host groupbuys and easily keep track of the items the participants has bought, it also allows user to browse various groupbuys that are available.

## ERD diagram for database

![Database Grupple](https://github.com/KeearnM/Grupple/assets/75174570/d575113a-19ad-4ba5-8c8f-bad0d4ab47b0)



## Planned Stack
 - Flask
 - Postgres
 - React

## Screenshots

### Pre login home page
<img width="1246" alt="Screenshot 2024-05-03 at 11 55 12" src="https://github.com/KeearnM/Grupple/assets/75174570/01950b9b-7816-421d-b9bb-84554522f17b">
<img width="1236" alt="Screenshot 2024-05-03 at 11 55 45" src="https://github.com/KeearnM/Grupple/assets/75174570/060384c5-a9f4-443f-9405-66e41bce4bac">
<img width="1242" alt="Screenshot 2024-05-03 at 12 00 37" src="https://github.com/KeearnM/Grupple/assets/75174570/28710c70-db1d-4cab-8068-b3e1af05a402">

In the image above, the user is prevented from joining the groupbuy unless they are logged in

### Post login home page
<img width="1245" alt="Screenshot 2024-05-03 at 12 03 43" src="https://github.com/KeearnM/Grupple/assets/75174570/29d91513-639b-4b72-875e-6ece1316fbf6">

The user now has access to the join button after they are logged in

<img width="1227" alt="Screenshot 2024-05-03 at 12 03 22" src="https://github.com/KeearnM/Grupple/assets/75174570/ac5a1ade-4ff0-4cc7-a445-c90c25ae1378">
<img width="1235" alt="Screenshot 2024-05-03 at 12 02 55" src="https://github.com/KeearnM/Grupple/assets/75174570/bbd90553-3663-4d07-ab33-f8cf7591fbd4">

### Host page, Profile page and Admin page
<img width="1242" alt="Screenshot 2024-05-03 at 12 06 26" src="https://github.com/KeearnM/Grupple/assets/75174570/d323741a-c357-46d2-9aae-f1ec1276b19a">

The admin page shown above is only accessible when you are logged in as an admin

<img width="1250" alt="Screenshot 2024-05-03 at 12 05 50" src="https://github.com/KeearnM/Grupple/assets/75174570/6e0dfded-984b-4a26-970e-5ef3f27542e2">

In the profile page you can track the groupbuys you have joined 


<img width="1247" alt="Screenshot 2024-05-03 at 12 05 30" src="https://github.com/KeearnM/Grupple/assets/75174570/ba73c824-35dd-4a80-9d15-8ce44704d388">

<img width="1257" alt="Screenshot 2024-05-03 at 12 05 06" src="https://github.com/KeearnM/Grupple/assets/75174570/703b98ec-e200-4424-89e1-ede9de6658b6">

And for the 2 images above, both function like a mini dashboard showing information about the groupbuys they have hosted

## Technologies used

Front End - React

React was just because of familiarity but other than that React modular components was useful for some aspects of the app. The navbar component was reused for the all the pages of the app and was used to display whether the user was logged in our logged out based on the presence of the access code

Back End - React with Postgres SQL, and Neon

For my backend I decided to use Flask with an ORM namely SQLAlchemy, Flask is lightweight and easy to use. Frameworks and libraries are easy to use too, when JWT for authentication was required for the app I can easily just install flask_jwt_extended and use @jwt_required for all my routes to make sure the authentication was necessary to access them. Neon also make it easy to access my database as an online Postgres SQL service.

## Routes used for app

/user (PUT)

This route create a users for our app, every user defaults to a normal user (is_admin is defaulted to false), regex is used for validating to the email format. The password is hashed in bcrypt before it is stored in the database

/login (POST)

This route recieve an email and password and check against the database for the email address before hashing the password in bcrypt and comparing it against the information in the database. If it matches an access code, along with the user_id and whether the user is an admin information is returned.

/groupbuys (GET)

This route is used on the homepage to fetch information about all the existing group buys that are available, the query fetches all the groupbuys after joining it with the user table to get the host name and also uses a filter to return group buys where the end date is later than the current date

/groupbuys/:id (GET)

This route is used for getting the groupbuys that the current user that is logged in the app has joined. It joins the listing, participant, user and groupbuy table and returns the information needed.

/groupbuys/host/id (POST)

This route is used for getting all the groupbuys the host has hosted/created it just calls the groupbuy table straght without any joins and return all the entries that matches the user_id that was submitted to it

/listings/:id (GET)

This route returns all the listing that is created under the groupbuy when the groupbuy_id is submitted to it, the listing is called straight without any joins as well as the table has all the information needed

/listings (PUT)

This adds to the listings table, it receives the groupbuy_id and the product_name in the body and adds to the listing table

/groupbuys (PUT)

This adds a listing into the groupbuy table when called, all the information is sent via the body and added to the table

/groupbuy/participants/:id (GET)

This route gets all the participants that has participated in a specific groupbuy when the groupbuy_id is submitted to it, the pacipant_id, amount, payment, name (from the user table) and the listing_name (from the listings table)

/groupbuy/total/participants/:id (GET)

This route returns a total of each individual listing amount linked to a groupbuy, it gives a total of each listing that was purchased by the every user that joined the groupbuy e.g (Jane - red bottle x 1 blue bottle x 1, Bob red bottle x 2 blue bottle x 1 (This is stored in the participants table) will return red bottle x 3 blue bottle x2). The route returns the information after a groupbuy_id is submitted to it
