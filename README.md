# Water Allocation Monitoring System

A comprehensive React frontend application for monitoring and managing water allocation between Pantabangan Reservoir and Cuyapo Agricultural Area. This system provides real-time calculations, data visualization, and professional reporting capabilities.

## Features

### 📊 **Input Forms**
- **Water Input Form**: Reservoir data including storage capacity, current volume, inflow rates, and rainfall
- **Farm Data Form**: Agricultural data with crop distribution, soil moisture, and irrigation efficiency
- **Allocation Calculator**: Calculation parameters including priority levels and allocation methods

### 📈 **Real-time Calculations**
- Automatic water allocation calculations based on input parameters
- Support for both proportional and equal priority allocation methods
- Environmental flow considerations
- Priority-based allocation multipliers

### 📊 **Data Visualization**
- Water balance pie chart
- Allocation distribution bar charts
- Historical trend line charts
- Area vs allocation scatter plots

### 💾 **Data Management**
- Save/load functionality with localStorage
- Export results to JSON format
- Reset to default values
- Mock data initialization

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Usage

### 1. **Enter Water Data**
   - Total Storage Capacity (million m³)
   - Current Storage Volume (million m³)
   - Daily Inflow Rate (m³/day)
   - Rainfall in Watershed (mm)

### 2. **Enter Farm Data**
   - Number of Farms
   - Total Agricultural Area (hectares)
   - Crop Type Distribution (Rice, Corn, Vegetables)
   - Current Soil Moisture (%)
   - Irrigation Efficiency (%)

### 3. **Set Calculation Parameters**
   - Priority Level (High/Medium/Low)
   - Water Allocation Method (Proportional/Equal Priority)
   - Minimum Environmental Flow (m³/day)
   - Calculation Period (days)

### 4. **View Results**
   - Real-time calculation results
   - Water balance analysis
   - Distribution per crop type
   - Efficiency metrics

### 5. **Data Management**
   - Save current data to browser storage
   - Load previously saved data
   - Export results to JSON file
   - Reset to default values

## Technical Details

### **Water Allocation Logic**
- **Proportional Method**: Allocates water based on crop area percentage
- **Equal Priority Method**: Allocates equal water per farm regardless of area
- **Priority Multipliers**: High (1.2x), Medium (1.0x), Low (0.8x)
- **Environmental Flow**: Reserved water for environmental needs

### **Crop Water Requirements**
- Rice: 8.5 m³/day per hectare
- Corn: 6.0 m³/day per hectare
- Vegetables: 4.5 m³/day per hectare

### **Calculation Factors**
- Soil moisture impact on water demand
- Irrigation efficiency adjustments
- Rainfall contribution to water availability
- Storage and inflow considerations

## Components

- `WaterInputForm.js` - Reservoir data input
- `FarmDataForm.js` - Agricultural data input
- `AllocationCalculator.js` - Calculation parameters
- `ResultsDisplay.js` - Results presentation
- `DataCharts.js` - Data visualization
- `App.js` - Main application logic

## Dependencies

- React 18.2.0
- Recharts 2.8.0 (for data visualization)
- Lucide React 0.263.1 (for icons)

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Academic Use

This application is designed for academic research and educational purposes in water resource management. It provides a comprehensive tool for:

- Water allocation modeling
- Agricultural water demand analysis
- Reservoir management studies
- Environmental flow assessment
- Policy impact analysis

## License

This project is for academic and educational use only.






