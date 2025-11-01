import numpy as np
from deap import algorithms, base, creator, tools
import random

def calculate_jain_fairness(allocations):
    """
    Calculate Jain's Fairness Index for water allocation.
    JFI = (sum of allocations)^2 / (n * sum of squares)
    Range: [1/n, 1] where 1 is perfectly fair
    """
    if len(allocations) == 0 or sum(allocations) == 0:
        return 0.0
    
    sum_allocs = sum(allocations)
    sum_squares = sum(x * x for x in allocations)
    
    if sum_squares == 0:
        return 1.0
    
    n = len(allocations)
    jfi = (sum_allocs ** 2) / (n * sum_squares)
    return jfi

def calculate_water_efficiency(allocations, demands):
    """
    Calculate water efficiency as the ratio of satisfied demand.
    Efficiency = sum(min(allocation, demand)) / sum(demand)
    """
    if sum(demands) == 0:
        return 1.0
    
    satisfied = sum(min(allocations[i], demands[i]) for i in range(len(allocations)))
    return satisfied / sum(demands)

def evaluate_fitness(individual, total_water_supply, farm_sizes, crop_water_reqs, canal_capacities):
    """
    Evaluate the fitness for a single individual (solution).
    Returns tuple of (f1, f2, f3) where:
    - f1: Total water shortage (minimize)
    - f2: Negative of Jain's Fairness Index (minimize, so we maximize fairness)
    - f3: Negative of Water Efficiency (minimize, so we maximize efficiency)
    """
    allocations = list(individual)
    
    # Calculate water demands
    demands = [farm_sizes[i] * crop_water_reqs[i] for i in range(len(farm_sizes))]
    
    # Calculate total shortage (f1 - minimize)
    shortage = sum(max(0, demands[i] - allocations[i]) for i in range(len(demands)))
    
    # Calculate Jain's Fairness Index (f2 - maximize, so we minimize negative)
    jain_index = calculate_jain_fairness(allocations)
    
    # Calculate Water Efficiency (f3 - maximize, so we minimize negative)
    efficiency = calculate_water_efficiency(allocations, demands)
    
    # Return as minimization problem
    return (shortage, -jain_index, -efficiency)

def check_constraints(individual, total_water_supply, farm_sizes, crop_water_reqs, canal_capacities):
    """
    Check if an individual satisfies all constraints.
    Returns True if valid, False otherwise.
    """
    allocations = list(individual)
    
    # Constraint 1: Total water allocation cannot exceed total supply
    if sum(allocations) > total_water_supply:
        return False
    
    # Constraint 2: Each allocation cannot exceed canal capacity
    for i, allocation in enumerate(allocations):
        if allocation > canal_capacities[i]:
            return False
    
    # Constraint 3: Allocations must be non-negative
    if any(x < 0 for x in allocations):
        return False
    
    return True

def run_nsga2_optimization(total_water_supply, farm_sizes, crop_water_reqs, canal_capacities, 
                           population_size=50, generations=100, 
                           crossover_prob=0.9, mutation_prob=0.1):
    """
    Run NSGA-II optimization for water allocation.
    
    Parameters:
    -----------
    total_water_supply : float
        Total available water supply (m³)
    farm_sizes : list
        List of farm sizes in hectares
    crop_water_reqs : list
        List of crop water requirements (m³/hectare)
    canal_capacities : list
        List of canal capacities (m³)
    
    Returns:
    --------
    dict : Optimization results
    """
    num_farms = len(farm_sizes)
    
    # Create fitness and individual classes for DEAP
    creator.create("FitnessMin", base.Fitness, weights=(-1.0, -1.0, -1.0))
    creator.create("Individual", list, fitness=creator.FitnessMin)
    
    toolbox = base.Toolbox()
    
    # Register attribute generator (each farm gets 0 to its canal capacity)
    toolbox.register("attr_float", random.uniform, 0, max(canal_capacities) if canal_capacities else total_water_supply)
    
    # Register individual and population generator
    toolbox.register("individual", tools.initRepeat, creator.Individual, toolbox.attr_float, num_farms)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)
    
    # Register evaluation function
    toolbox.register("evaluate", evaluate_fitness, 
                     total_water_supply=total_water_supply,
                     farm_sizes=farm_sizes,
                     crop_water_reqs=crop_water_reqs,
                     canal_capacities=canal_capacities)
    
    # Register constraint checker
    toolbox.register("check_constraints", check_constraints,
                     total_water_supply=total_water_supply,
                     farm_sizes=farm_sizes,
                     crop_water_reqs=crop_water_reqs,
                     canal_capacities=canal_capacities)
    
    # Register selection operator (NSGA-II uses tournament selection)
    toolbox.register("select", tools.selNSGA2)
    
    # Register crossover operator (Simulated Binary Crossover - SBX)
    toolbox.register("mate", tools.cxSimulatedBinaryBounded, 
                     low=[0.0] * num_farms,
                     up=canal_capacities,
                     eta=15.0)
    
    # Register mutation operator (Polynomial Bounded Mutation)
    toolbox.register("mutate", tools.mutPolynomialBounded,
                     low=[0.0] * num_farms,
                     up=canal_capacities,
                     eta=20.0,
                     indpb=1.0/num_farms)
    
    # Create initial population
    population = toolbox.population(n=population_size)
    
    # Evaluate initial population
    fitnesses = [toolbox.evaluate(ind) for ind in population]
    for ind, fit in zip(population, fitnesses):
        ind.fitness.values = fit
    
    # Run NSGA-II algorithm
    # We need to filter valid solutions at each generation
    for gen in range(generations):
        # Selection
        offspring = toolbox.select(population, len(population))
        offspring = list(map(toolbox.clone, offspring))
        
        # Apply crossover and mutation
        for child1, child2 in zip(offspring[::2], offspring[1::2]):
            if random.random() < crossover_prob:
                toolbox.mate(child1, child2)
                del child1.fitness.values
                del child2.fitness.values
        
        for mutant in offspring:
            if random.random() < mutation_prob:
                toolbox.mutate(mutant)
                del mutant.fitness.values
        
        # Evaluate new individuals and check constraints
        invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = [toolbox.evaluate(ind) for ind in invalid_ind]
        for ind, fit in zip(invalid_ind, fitnesses):
            ind.fitness.values = fit
        
        # Replace population with offspring
        population = offspring
    
    # Get Pareto front
    pareto_front = tools.sortNondominated(population, len(population), first_front_only=True)[0]
    
    # Select best solution from Pareto front (one with best balance)
    # For now, we'll use the solution with the minimum total shortage
    best_solution = min(pareto_front, key=lambda x: x.fitness.values[0])
    allocations = list(best_solution)
    
    # Calculate metrics for the best solution
    demands = [farm_sizes[i] * crop_water_reqs[i] for i in range(num_farms)]
    total_shortage = sum(max(0, demands[i] - allocations[i]) for i in range(num_farms))
    fairness_index = calculate_jain_fairness(allocations)
    efficiency = calculate_water_efficiency(allocations, demands)
    
    # Prepare results
    results = {
        'allocations': [
            {
                'farm_id': i + 1,
                'farm_size': farm_sizes[i],
                'water_allocated': round(allocations[i], 2),
                'shortage': round(max(0, demands[i] - allocations[i]), 2)
            }
            for i in range(num_farms)
        ],
        'metrics': {
            'total_shortage': round(total_shortage, 2),
            'fairness_index': round(fairness_index, 2),
            'water_efficiency': round(efficiency, 2)
        }
    }
    
    # Clean up creator classes
    del creator.FitnessMin
    del creator.Individual
    
    return results

