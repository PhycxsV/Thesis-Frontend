# AgriRise: Optimization of Irrigation Water Allocation in Cuyapo, Nueva Ecija Using NSGA-II Genetic Algorithm

A React-based web application for optimizing irrigation water allocation using the Non-dominated Sorting Genetic Algorithm II (NSGA-II) in the Cuyapo agricultural region of Nueva Ecija, Philippines.

## System Requirements

### Node.js and npm

This application requires Node.js version 14.0.0 or higher and npm version 6.0.0 or higher.

To check your current versions, run:
```
node --version
npm --version
```

If you do not have Node.js installed, download it from:
https://nodejs.org/

Note: npm is included with Node.js installation.

### Dependencies

The following dependencies are required and will be installed automatically:

- React version 17.0.2
- React DOM version 17.0.2
- React Scripts version 3.4.4
- Recharts version 1.8.5 (for data visualization)
- Lucide React version 0.194.0 (for user interface icons)

All dependencies are specified in the package.json file and will be installed when you run npm install.

### Browser Compatibility

This application is supported on the following web browsers:

- Google Chrome (latest version recommended)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Safari (latest version)

JavaScript must be enabled in your browser for the application to function.

## Installation

1. Open your terminal or command prompt.

2. Navigate to the project directory:
```
cd Thesis-Frontend
```

3. Install all required dependencies:
```
npm install
```

This command will read the package.json file and install all necessary dependencies. The installation may take several minutes depending on your internet connection.

## Running the Application

1. Start the development server:
```
npm start
```

2. The application will automatically open in your default web browser at:
```
http://localhost:3000
```

If the browser does not open automatically, manually navigate to http://localhost:3000

3. To stop the development server, press Ctrl+C in your terminal.

## Building for Production

To create an optimized production build:

1. Run the build command:
```
npm run build
```

2. The built files will be in the 'build' folder. You can deploy this folder to any static file hosting service.

## Project Structure

- src/
  - App.js - Main application component and logic
  - components/
    - WelcomeScreen.js - Initial welcome screen
    - WaterInputForm.js - Water resource data input
    - FarmDataForm.js - Agricultural data input
    - AllocationCalculator.js - NSGA-II calculation parameters
    - ResultsDisplay.js - Results display and visualization
  - index.js - Application entry point
  - index.css - Global styles and responsive design

- public/
  - index.html - Main HTML file

## Features

The application includes:

- Welcome screen with system overview and instructions
- Water resource data input (storage capacity, volume, inflow rates, rainfall)
- Agricultural data input (number of farms, crop areas, soil moisture, irrigation efficiency)
- NSGA-II genetic algorithm parameters configuration
- Constraint weights for equity, sustainability, and demand fulfillment
- Real-time water allocation calculations
- Results visualization and analysis

## Testing

To run the test suite:
```
npm test
```

## Technical Specifications

- React 17.0.2 for user interface components
- Responsive design supporting desktop, tablet, and mobile devices
- CSS3 with flexbox and grid layouts
- No build tools required beyond react-scripts
- ES6+ JavaScript syntax

## Troubleshooting

If you encounter issues during installation:

1. Delete the node_modules folder and package-lock.json file
2. Run npm install again
3. Ensure you have Node.js version 14.0.0 or higher
4. Clear your npm cache: npm cache clean --force

If the application does not start:

1. Check that port 3000 is available
2. Ensure no firewall is blocking the application
3. Try running npm start with administrator privileges

For build errors:

1. Delete the build folder
2. Run npm install again
3. Run npm run build

## Academic Use

This application is designed for academic research purposes. It implements the NSGA-II genetic algorithm for multi-objective optimization of irrigation water allocation, considering constraints of equity, sustainability, and demand fulfillment with the objective of maximizing crop production.

## License

This project is for academic and educational use only.

## Contact

For questions or issues regarding this application, please contact the development team or refer to the thesis documentation.
