# Final Project Report:
## Team Information
Name: Stephen Lucas

Email Address: stephen.lucas@mail.utoronto.ca

Student Number: 1011819089

## Motivation
As employee training evolves from purely online formats to formats utilizing technologies like AR/VR and other offline tools, the ability to judge the effectiveness of this training is hindered. Companies will often adopt a learning management system (LMS) in order to simply give quizzes or surveys to their employees. However, these typically offer much more functionality than a simple survey service and are therefore much more expensive. In order to offer an alternative, this project was created.

## Objectives

The goal of this project is to provide a solution in the form of a quiz/survey service that can be connected to outside learning solutions through industry standard XAPI statements. This would allow companies to be able to evaluate training effectiveness without having to subscribe to a large LMS service.

Providing basic results viewing allows users to see a general view of how the survey/quiz was completed. This project does not intend to replace soltuions companies may have adopted for viewing training data, and instead aims to be able to easily integrate with these systems through generated XAPI files.

## Technical Stack

The project utilizes a Next.js full-stack approach. The data is stored in a PostgreSQL database with prisma ORM integration. The result data is cached in the database for fast reads, but the XAPI statements corresponding to he results are stored on AWS S3. Additionally, Shadcn, Rechart.js, and Tailwind CSS were utilized in order to simplify UI design.

## Features

The main features are as follows: 
- User Authentication
- User/Group Management
- Quiz Creation/Management
- Take Quizzes
- View Quiz Results
- Download results from S3

The architectural core technical requirements are covered by utilizing Next.js, Tailwind CSS, and shadcn, as well as PostgreSQL as described in the previous section.

The advanced features include user authentication and authorization by requiring login on every route, and locking management functionality behind user permission flags. Additionally, file handling/api integration is handled by uploading/downloading files from AWS S3. Lastly, there is some complex state management involved with taking/creating quizzes.

## User Guide

As a user without management permissions, the flow is simple. After entering your login information, you will be directed to the dashboard where you will have the option to take quizzes assigned to you. Clicking on "Take" will open the quiz interface. Filling out this interface and clicking save will result in your response being saved. Lastly, there is a logout button in the navbar for when you are finished taking quizzes.

Naviagating to the login page without logging out will redirect the user to their dashboard. If the user is not logged in and tries to access pages, they will be redirected to the login page.

As a user with management permissions, you will notice after logging in there are more options in the navbar.

### Manage Users
Clicking on manage users will display a list of all users in the system. From this list, you can delete, edit or create new users. Clicking on create or edit will lead to a form that allows you to manage a user in the system. Clicking on "IsManager" allows the editted or created user to also manage users, groups and quizzes.

### Manage Groups
Clicking on manage groups will display a list of groups in the system. From this list, you can delete, edit or create new groups. Clicking on create or edit will allow you to change which users are assigned to the group or the name of the group.

### Manage Quizzes
Clicking on manage quizzes will display a list of quizzes in the system. From there you can assign, create, edit or delete quizzes. Assigning the quiz will allow you to give the quiz to users or groups to allow them to take and submit responses for the quiz. Editing and creating will allow you to modify the questions or choices of those questions for quizzes.

Additionally, on the dashboard you will see an additional table of quizzes in the system. You can view the quiz results by clicking on "View" in the row of the quiz you want to view. Clicking on this will show you the number of results, how users answered, and allows you to download the session as an XAPI statement.

## Development Guide

### Environment setup and configuration
Setting up the environment is simple. running 'npm install' at the root directory should install all packages needed to build/run the project.

An .env file will need to be created containing the following properties:

- DATABASE_URL - A connection string for the PostgreSQL database
- BETTER_AUTH_SECRET - A randomly generated string 
- BETTER_AUTH_URL - Base URL of the application

### Database initialization
Running npx prisma init will create the tables needed for the project as long as the database connection string is set.

Once the database is set up, run

npm run init

to set up the default user. The default user has the username "administrator" and password "administrator". Once the user is created, log in as the user and change the password through the manage users interface.

### Cloud storage configuration
The .env file will also need the following properties:

- AWS_BUCKET_NAME - Name of S3 bucket
- AWS_REGION - Name of the region the S3 bucket is in
- AWS_ACCESS_KEY_ID - ID of an access key for a user with permissions to the bucket
- AWS_ACCESS_KEY - Access key for user with permissions to the bucket

## Individual Contributions
As this was a solo project, all contributions were made by myself, Stephen Lucas.  The contributions were made over the course of a couple of weeks and amounts to a few thousand lines of code across over 30+ files.

## Lessions Learned and Concluding Remarks
This project allowed me to learn many things from simple javascript form issues to complex react state management quirks. Setting up and processing complicated forms for quiz management allowed me to realize the intricacies of forms, such as checkboxes not submitting unless they are checked as an example. There were quite a few issues that arose from problems such as this that complicated the form process.

Additionally, making sure child components wouldn't rerender react parents on state changes made me realize the importance of properly formatting a component heirarchy. Being able to utilize the same component to render in different contexts was also a learning experience and a challenge to implement in order to create reusable code.

The importance of typescript in ensuring code is robust was very apparent in development as well. Ensuring prop types and variable accesses were correct allows for a more streamline development experience with less time debugging javascript issues. Without typescript, and without learning how to utilize it properly, this project would have taken quite a bit more time debugging and developing. Unfortunately, I was not able to fully take advantage of typescript by ensuring there were no typescript errors, as I ran out of time to clean up the code entirely. I would have liked to have spent more time on increasing code quality in this regard.



## Video Demo