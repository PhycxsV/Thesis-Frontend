from flask import Flask, request, jsonify
from flask_cors import CORS
from nsga2 import run_nsga2_optimization
import sys
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/optimize', methods=['POST'])
def optimize():
    try:
        data = request.get_json()
        
        # Validate incoming data
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['total_water_supply', 'num_farms', 'farm_sizes', 'crop_water_reqs', 'canal_capacities']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract parameters
        total_water_supply = float(data['total_water_supply'])
        num_farms = int(data['num_farms'])
        farm_sizes = [float(x) for x in data['farm_sizes']]
        crop_water_reqs = [float(x) for x in data['crop_water_reqs']]
        canal_capacities = [float(x) for x in data['canal_capacities']]
        
        # Validate array lengths match
        if not (len(farm_sizes) == len(crop_water_reqs) == len(canal_capacities) == num_farms):
            return jsonify({'error': 'Array lengths must match num_farms'}), 400
        
        # Run optimization
        try:
            results = run_nsga2_optimization(
                total_water_supply=total_water_supply,
                farm_sizes=farm_sizes,
                crop_water_reqs=crop_water_reqs,
                canal_capacities=canal_capacities
            )
            
            return jsonify(results)
        except Exception as opt_error:
            return jsonify({'error': f'Optimization failed: {str(opt_error)}'}), 500
            
    except ValueError as ve:
        return jsonify({'error': f'Invalid data format: {str(ve)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    # Make sure we can import the nsga2 module
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, backend_dir)
    
    app.run(debug=True, port=5000)

