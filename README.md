# AgriRise: Optimization of Irrigation Water Allocation in Cuyapo, Nueva Ecija Using NSGA-II Genetic Algorithm

A full-stack web application for optimizing irrigation water allocation using the Non-dominated Sorting Genetic Algorithm II (NSGA-II) in the Cuyapo agricultural region of Nueva Ecija, Philippines.

## System Requirements

### Frontend Requirements

Node.js version 14.0.0 or higher and npm version 6.0.0 or higher.

To check your current versions, run:
```
node --version
npm --version
```

If you do not have Node.js installed, download it from:
https://nodejs.org/

Note: npm is included with Node.js installation.

### Backend Requirements

Python version 3.7 or higher and pip (Python package installer).

To check your current versions, run:
```
python --version
pip --version
```

If you do not have Python installed, download it from:
https://www.python.org/downloads/

## Installation

### Frontend Installation

1. Navigate to the project directory:
```
cd Thesis-Frontend
```

2. Install all required frontend dependencies:
```
npm install
```

This will install:
- React 17.0.2
- React Router DOM 5.3.4
- Axios 0.27.2
- Recharts 1.8.5
- Lucide React 0.194.0

### Backend Installation

1. Navigate to the backend directory:
```
cd backend
```

2. Create a virtual environment (recommended):
```
python -m venv venv
```

3. Activate the virtual environment:

On Windows:
```
venv\Scripts\activate
```

On Linux/Mac:
```
source venv/bin/activate
```

4. Install Python dependencies:
```
pip install -r requirements.txt
```

This will install:
- Flask 2.3.3
- Flask-CORS 4.0.0
- DEAP 1.3.3
- NumPy 1.24.3

## Running the Application

### Starting the Backend Server

1. Navigate to the backend directory:
```
cd backend
```

2. Activate the virtual environment (if not already activated):
```
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. Start the Flask server:
```
python app.py
```

The backend server will start on http://localhost:5000

### Starting the Frontend Server

1. Open a new terminal window and navigate to the project root:
```
cd Thesis-Frontend
```

2. Start the React development server:
```
npm start
```

The application will automatically open in your default web browser at http://localhost:3000

If the browser does not open automatically, manually navigate to http://localhost:3000

### Using the Application

1. The landing page will display "How It Works" with three steps explaining the system.

2. Click "Get Started" to go to the main input page.

3. On the input page:
   - Enter total available water supply
   - Specify the number of farms
   - For each farm, provide: farm size, crop water requirement, and canal capacity

4. Click "Generate Optimal Allocation" to run the NSGA-II optimization.

5. View results including:
   - Optimized water allocation per farm
   - Performance metrics (total shortage, fairness index, water efficiency)
   - Visual charts showing allocation vs demand

6. Export results or go back to modify inputs.

### Features

The application provides the following features:

- Landing page with system overview and three-step process explanation
- Dynamic input form that generates farm sections based on number of farms
- NSGA-II multi-objective optimization with three objectives:
  - Minimize total water shortage
  - Maximize equity (Jain's Fairness Index)
  - Maximize water efficiency
- Real-time constraint validation
- Comprehensive results display with metrics and visualizations
- Export functionality for results
- Responsive design for desktop, tablet, and mobile devices

## Building for Production

### Frontend Build

To create an optimized production build of the frontend:

```
npm run build
```

The built files will be in the 'build' folder. Deploy this folder to any static file hosting service.

### Backend Deployment

For production deployment, configure a WSGI server such as Gunicorn or uWSGI instead of the Flask development server.

## Project Structure

- src/
  - App.js - Main application component with routing
  - components/
    - WelcomeScreen.js - Landing page component
    - MainInputPage.jsx - Input form with dynamic farm fields
    - ResultsPage.jsx - Results display with charts
  - index.js - Application entry point
  - index.css - Global styles and responsive design

- backend/
  - app.py - Flask application with API endpoints
  - nsga2.py - NSGA-II optimization implementation
  - requirements.txt - Python dependencies

- public/
  - index.html - Main HTML file

## API Documentation

### POST /api/optimize

Optimize water allocation using NSGA-II algorithm.

Request Body (JSON):
```
{
  "total_water_supply": 100000,
  "num_farms": 3,
  "farm_sizes": [50, 60, 70],
  "crop_water_reqs": [8.5, 10.0, 8.5],
  "canal_capacities": [40000, 45000, 40000]
}
```

Response (JSON):
```
{
  "allocations": [
    {
      "farm_id": 1,
      "farm_size": 50,
      "water_allocated": 33333.33,
      "shortage": 91666.67
    }
  ],
  "metrics": {
    "total_shortage": 150000,
    "fairness_index": 0.95,
    "water_efficiency": 0.82
  }
}
```

### GET /api/health

Check backend server health status.

Response:
```
{
  "status": "healthy"
}
```

## Testing

### Frontend Testing

To run the test suite:
```
npm test
```

### Backend Testing

Test the API endpoints using tools like curl or Postman:
```
curl http://localhost:5000/api/health
```

## Technical Specifications

Frontend:
- React 17.0.2 with functional components and hooks
- React Router 5.3.4 for client-side routing
- Axios 0.27.2 for HTTP requests
- Recharts for data visualization
- Responsive CSS with flexbox and grid layouts

Backend:
- Flask 2.3.3 web framework
- DEAP 1.3.3 for genetic algorithm implementation
- NumPy 1.24.3 for numerical computations
- Flask-CORS for cross-origin resource sharing

## Troubleshooting

### Frontend Issues

If you encounter issues during installation:
1. Delete node_modules folder and package-lock.json
2. Run npm install again
3. Ensure Node.js version 14.0.0 or higher
4. Clear npm cache: npm cache clean --force

If the application does not start:
1. Check that port 3000 is available
2. Try running npm start with administrator privileges

### Backend Issues

If Python import errors occur:
1. Ensure virtual environment is activated
2. Verify all packages in requirements.txt are installed
3. Check Python version is 3.7 or higher

If the backend server fails to start:
1. Check that port 5000 is available
2. Verify Flask is installed correctly
3. Check app.py for syntax errors

### Connection Issues

If the frontend cannot connect to the backend:
1. Ensure the backend server is running on port 5000
2. Check firewall settings are not blocking localhost connections
3. Verify CORS is properly configured in app.py
4. The frontend will automatically fall back to mock data if the backend is unavailable

## Academic Use

This application is designed for academic research purposes. It implements the NSGA-II genetic algorithm for multi-objective optimization of irrigation water allocation in the Cuyapo agricultural region. The system considers three objectives:

1. Minimize total water shortage across all farms
2. Maximize equity using Jain's Fairness Index for water distribution
3. Maximize water efficiency by meeting crop water requirements

Constraints include total water supply limits, individual canal capacities, and non-negative allocation requirements.

## License

This project is for academic and educational use only.

## Contact

For questions or issues regarding this application, please contact the development team or refer to the thesis documentation.
