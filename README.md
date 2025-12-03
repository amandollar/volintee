# Volintee

Volintee is a modern web platform designed to bridge the gap between enthusiastic volunteers and organizations making a difference. It provides a seamless experience for organizations to post opportunities and for volunteers to find and apply for them.

## 🚀 Features

### For Volunteers
- **Browse Opportunities**: Explore a wide range of volunteering opportunities with advanced filtering (interests, location, availability).
- **Easy Application**: Apply to opportunities with a personalized message in just a few clicks.
- **Dashboard**: Track the status of your applications (Pending, Approved, Rejected) in real-time.
- **Profile Management**: Showcase your skills, interests, and bio to stand out to organizations.

### For Organizations
- **Create Opportunities**: Post detailed opportunities with images, requirements, and skills needed.
- **Application Management**: View, approve, or reject applications directly from your dashboard.
- **Dashboard**: Get an overview of your active opportunities and application statistics.
- **Organization Profile**: Build a trusted profile to attract the right volunteers.

## 🛠️ Tech Stack

### Frontend
- **React**: Component-based UI library.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Axios**: Promise-based HTTP client.
- **React Router**: Declarative routing for React.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express**: Fast, unopinionated web framework for Node.js.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT**: JSON Web Tokens for secure authentication.
- **Cloudinary**: Cloud-based image management.

## 🏁 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas connection string)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/amandollar/volintee.git
    cd volintee
    ```

2.  **Backend Setup**
    ```bash
    cd volintee-backend
    npm install
    ```
    Create a `.env` file in the `volintee-backend` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
    Start the backend server:
    ```bash
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd ../volintee-frontend
    npm install
    ```
    Start the frontend development server:
    ```bash
    npm run dev
    ```

4.  **Access the App**
    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
