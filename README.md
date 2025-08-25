1. Tech Stack Choice

Since they give freedom:

Backend → Express.js (simplest for quick prototyping).

Database → PostgreSQL (cleaner schema design, better JSON support if needed).

Frontend → React.js with Tailwind css for quick tables & forms.

2. Database Schema 

rating_app=# select * from users;
 id |         name         |           email           |            password             |        address        |    role

rating_app=# select * from stores;
 id |         name         |       email       |                           address                           | owner_id | avg_rating

rating_app=# select * from ratings;
 id | store_id | user_id | rating

3. Auth Flow

JWT-based login system (one table users for everyone).
On login → check role to decide dashboard.
Passwords stored hashed (bcrypt).
4. Functionalities Breakdown

System Administrator -

Add stores (assign owner if needed).
Add users (Normal/Admin).
Dashboard:
Total users, total stores, total ratings (simple aggregate queries).
List of stores with ratings:
Avg rating = AVG(rating) from ratings.
List of users with filters (name/email/address/role).
View user details (if store owner → include their avg store rating).
Sorting on tables.
<img src="https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/adminhome.png?raw=true" alt="Admin Home" width="500"/>
<img src="https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/userAdminDash.png?raw=true" alt="Admin UserList" width="500"/>
<img src="https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/adduser.png?raw=true" alt="Admin StoreList" width="500"/>
<img src="https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/addStore.png?raw=true" alt="Admin StoreList" width="500"/>
