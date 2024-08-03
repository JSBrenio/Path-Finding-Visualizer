import json
import pandas as pd
import matplotlib.pyplot as plt

files = ["data/0% walls/data.json", "data/10% walls/data.json", "data/20% walls/data.json", "data/30% walls/data.json"]
metrics = ['Steps', 'ms', 'Length', 'Nodes']  # keys in data.json
titles = ['Steps', 'Time', 'Length', 'Nodes Visited']

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
                ax.set_ylabel(metric)
                ax.legend()

        # Adjust layout to prevent overlap
        plt.tight_layout()

        # Show the plot
        plt.show()
    
    