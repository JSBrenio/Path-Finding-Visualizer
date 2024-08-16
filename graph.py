import json
import pandas as pd
import matplotlib.pyplot as plt

files = ["data/0% walls/data.json", "data/10% walls/data.json", "data/20% walls/data.json", "data/30% walls/data.json"]
metrics = ['steps', 'ms', 'length', 'nodes']  # keys in data.json
titles = ['Steps', 'Time', 'Length', 'Nodes Visited']

def seperated_graphs():
    for file_to_load in files:
        # Load the data from 'data.json'
        with open(file_to_load) as file:
                data = json.load(file)

        # Convert the data into a Pandas DataFrame for easier manipulation
        dataframes = {}
        for key in data.keys():
                dataframes[key] = pd.DataFrame(data[key])

        # Create a figure and a grid of subplots
        fig, axs = plt.subplots(2, 2, figsize=(16, 8))  # Adjust size as needed
        axs = axs.flatten()  # Flatten the array to make it easier to iterate over
        plt.get_current_fig_manager().set_window_title(file_to_load[5:8])

        for i, metric in enumerate(metrics):
            ax = axs[i]
            for key, df in dataframes.items():
                    ax.plot(df[metric], 'x', linestyle='None', label=key)  # 'x' specifies cross markers
            
            # Set x-axis ticks to show every trial index
            num_trials = len(df[metric])  # Assuming all metrics have the same number of trials
            ax.set_xticks(range(num_trials))  # Set ticks for every trial

            ax.set_title(titles[i])
            ax.set_xlabel('Trials')
            ax.set_ylabel(metric.capitalize())
            ax.legend()

        # Adjust layout to prevent overlap
        plt.tight_layout()

        # Show the plot
        plt.show()

def consolidated_graphs(subplots=True):
    all_metrics = set()  # Collect all possible metrics

    # First pass to collect all metrics from files
    for file_to_load in files:
        with open(file_to_load) as file:
            data = json.load(file)
            all_metrics.update(data.keys())  # Add keys from this file to the set of all metrics

    # Initialize combined_data with all collected metrics
    combined_data = {metric: pd.DataFrame() for metric in all_metrics}

    # Combine the data from all files
    for file_to_load in files:
        with open(file_to_load) as file:
            data = json.load(file)
        
        for key in data.keys():
            temp_df = pd.DataFrame(data[key])
            combined_data[key] = pd.concat([combined_data[key], temp_df], ignore_index=True) if not combined_data[key].empty else temp_df

    if subplots:
        # Create a figure and a grid of subplots
        fig, axs = plt.subplots(2, 2, figsize=(16, 8))
        axs = axs.flatten()
        plt.get_current_fig_manager().set_window_title('Trials Combined')

        # Plot the combined data for each metric
        for i, metric in enumerate(metrics):
            ax = axs[i]
            for key, df in combined_data.items():
                    ax.plot(df[metric], label=key)  # use line plot instead of 'x' markers

            ax.set_title(titles[i])
            ax.set_xlabel('Trials')
            ax.set_ylabel(metric.capitalize())
            ax.legend()
            
        # Adjust layout to prevent overlap
        plt.tight_layout()

        # Show the plot
        plt.show()
    else:
        # Display individual graphs for each metric
        for metric in metrics:
            plt.figure(figsize=(12, 6))
            for key, df in combined_data.items():
                plt.plot(df[metric], label=key)
            
            plt.title(metric.capitalize())
            plt.xlabel('Trials')
            plt.ylabel(metric.capitalize())
            plt.legend()
            plt.tight_layout()
            plt.show()
        
consolidated_graphs(False)