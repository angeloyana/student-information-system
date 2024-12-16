# Student Information System

Web-based solution for managing student information.

## Features

- Manage information about students, classrooms, teachers, and subjects.
- Secure user authentication and authorization.
- Monitor system activities.

## Installation

```
git clone https://github.com/angeloyana/student-information-system

cd ./student-information-system

# Install dependencies and build the system
npm install
npm run build
```

## Usage

Follow these steps to get started:

```
# Set the required environment variable
export DATABASE_URL="<file_path>"

# Create the first user
npm run app:create-user <first_name> <last_name> superuser <email> <admin>
```

Run `npm run preview` to start the server then open `http://localhost:4173`
in your **Web Browser**.

Login with the user you created and you're ready to go! 🎉

> [!NOTE]
> If you want to expose the app to your network, you can run
> `npm run preview -- --host` instead then replace `localhost` with the ip
> address that will be shown.

## License

This project is licensed under the [MIT License](./LICENSE)
