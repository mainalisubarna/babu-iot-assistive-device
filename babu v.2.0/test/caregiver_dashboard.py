import json
import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

class CaregiverDashboard:
    def __init__(self, data_file='medicine_data.json'):
        self.data_file = data_file
        self.root = tk.Tk()
        self.root.title("Medicine Caregiver Dashboard")
        self.root.geometry("800x600")
        
        self.setup_ui()
        self.refresh_data()
    
    def load_medicines(self):
        """Load medicines from JSON file"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data['medicines']
        except FileNotFoundError:
            return []
    
    def save_medicines(self, medicines):
        """Save medicines back to JSON file"""
        data = {'medicines': medicines}
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def setup_ui(self):
        """Setup the user interface"""
        # Create notebook for tabs
        notebook = ttk.Notebook(self.root)
        notebook.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Status tab
        self.status_frame = ttk.Frame(notebook)
        notebook.add(self.status_frame, text="Medicine Status")
        self.setup_status_tab()
        
        # Management tab
        self.manage_frame = ttk.Frame(notebook)
        notebook.add(self.manage_frame, text="Manage Medicines")
        self.setup_management_tab()
        
        # Analytics tab
        self.analytics_frame = ttk.Frame(notebook)
        notebook.add(self.analytics_frame, text="Analytics")
        self.setup_analytics_tab()
    
    def setup_status_tab(self):
        """Setup medicine status display"""
        # Title
        title_label = tk.Label(self.status_frame, text="Today's Medicine Status", 
                              font=('Arial', 16, 'bold'))
        title_label.pack(pady=10)
        
        # Treeview for medicine list
        columns = ('Name', 'Time', 'Dosage', 'Pouch', 'Status', 'Last Taken')
        self.status_tree = ttk.Treeview(self.status_frame, columns=columns, show='headings')
        
        for col in columns:
            self.status_tree.heading(col, text=col)
            self.status_tree.column(col, width=120)
        
        self.status_tree.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Refresh button
        refresh_btn = tk.Button(self.status_frame, text="Refresh", 
                               command=self.refresh_data, bg='lightblue')
        refresh_btn.pack(pady=5)
    
    def setup_management_tab(self):
        """Setup medicine management interface"""
        # Add medicine section
        add_frame = tk.LabelFrame(self.manage_frame, text="Add New Medicine", padx=10, pady=10)
        add_frame.pack(fill='x', padx=10, pady=10)
        
        # Input fields
        tk.Label(add_frame, text="Medicine Name:").grid(row=0, column=0, sticky='w')
        self.name_entry = tk.Entry(add_frame, width=20)
        self.name_entry.grid(row=0, column=1, padx=5)
        
        tk.Label(add_frame, text="Time (HH:MM):").grid(row=0, column=2, sticky='w')
        self.time_entry = tk.Entry(add_frame, width=10)
        self.time_entry.grid(row=0, column=3, padx=5)
        
        tk.Label(add_frame, text="Dosage:").grid(row=1, column=0, sticky='w')
        self.dosage_entry = tk.Entry(add_frame, width=10)
        self.dosage_entry.grid(row=1, column=1, padx=5)
        
        tk.Label(add_frame, text="Pouch Color:").grid(row=1, column=2, sticky='w')
        self.pouch_var = tk.StringVar()
        pouch_combo = ttk.Combobox(add_frame, textvariable=self.pouch_var, 
                                  values=['green', 'yellow', 'blue', 'red', 'white'])
        pouch_combo.grid(row=1, column=3, padx=5)
        
        add_btn = tk.Button(add_frame, text="Add Medicine", command=self.add_medicine, 
                           bg='lightgreen')
        add_btn.grid(row=2, column=0, columnspan=4, pady=10)
        
        # Medicine list for editing
        list_frame = tk.LabelFrame(self.manage_frame, text="Current Medicines", padx=10, pady=10)
        list_frame.pack(fill='both', expand=True, padx=10, pady=10)
        
        columns = ('ID', 'Name', 'Time', 'Dosage', 'Pouch')
        self.manage_tree = ttk.Treeview(list_frame, columns=columns, show='headings')
        
        for col in columns:
            self.manage_tree.heading(col, text=col)
            self.manage_tree.column(col, width=100)
        
        self.manage_tree.pack(fill='both', expand=True)
        
        # Buttons
        btn_frame = tk.Frame(list_frame)
        btn_frame.pack(fill='x', pady=5)
        
        delete_btn = tk.Button(btn_frame, text="Delete Selected", 
                              command=self.delete_medicine, bg='lightcoral')
        delete_btn.pack(side='left', padx=5)
        
        reset_btn = tk.Button(btn_frame, text="Reset Daily Status", 
                             command=self.reset_daily_status, bg='lightyellow')
        reset_btn.pack(side='left', padx=5)
    
    def setup_analytics_tab(self):
        """Setup analytics display"""
        # Placeholder for analytics
        analytics_label = tk.Label(self.analytics_frame, 
                                  text="Medicine Adherence Analytics\n(Feature coming soon)", 
                                  font=('Arial', 14))
        analytics_label.pack(expand=True)
    
    def refresh_data(self):
        """Refresh all data displays"""
        medicines = self.load_medicines()
        
        # Clear status tree
        for item in self.status_tree.get_children():
            self.status_tree.delete(item)
        
        # Clear manage tree
        for item in self.manage_tree.get_children():
            self.manage_tree.delete(item)
        
        # Populate trees
        for medicine in medicines:
            status = "✓ Taken" if medicine['taken'] else "○ Pending"
            last_taken = medicine.get('last_taken', 'Never')
            if last_taken and last_taken != 'Never':
                last_taken = datetime.fromisoformat(last_taken).strftime("%H:%M")
            
            # Status tree
            self.status_tree.insert('', 'end', values=(
                medicine['name'], medicine['time'], medicine['dosage'],
                medicine['pouch'], status, last_taken
            ))
            
            # Management tree
            self.manage_tree.insert('', 'end', values=(
                medicine['id'], medicine['name'], medicine['time'],
                medicine['dosage'], medicine['pouch']
            ))
    
    def add_medicine(self):
        """Add new medicine"""
        try:
            name = self.name_entry.get().strip()
            time_str = self.time_entry.get().strip()
            dosage = int(self.dosage_entry.get().strip())
            pouch = self.pouch_var.get().strip()
            
            if not all([name, time_str, dosage, pouch]):
                messagebox.showerror("Error", "Please fill all fields")
                return
            
            # Validate and format time
            try:
                time_obj = datetime.strptime(time_str, "%H:%M")
                time_str = time_obj.strftime("%H:%M")  # Ensure HH:MM format
            except ValueError:
                try:
                    # Try H:MM format
                    time_obj = datetime.strptime(time_str, "%H:%M")
                    time_str = time_obj.strftime("%H:%M")
                except ValueError:
                    messagebox.showerror("Error", "Invalid time format. Use HH:MM (e.g., 09:30)")
                    return
            
            medicines = self.load_medicines()
            new_id = max([m['id'] for m in medicines]) + 1 if medicines else 1
            
            new_medicine = {
                'id': new_id,
                'name': name,
                'time': time_str,
                'dosage': dosage,
                'pouch': pouch.lower(),
                'taken': False,
                'last_taken': None
            }
            
            medicines.append(new_medicine)
            self.save_medicines(medicines)
            
            # Clear entries
            self.name_entry.delete(0, tk.END)
            self.time_entry.delete(0, tk.END)
            self.dosage_entry.delete(0, tk.END)
            self.pouch_var.set('')
            
            self.refresh_data()
            messagebox.showinfo("Success", f"Added {name} to medicine list")
            
        except ValueError as e:
            messagebox.showerror("Error", "Invalid input. Please check your entries.")
    
    def delete_medicine(self):
        """Delete selected medicine"""
        selected = self.manage_tree.selection()
        if not selected:
            messagebox.showwarning("Warning", "Please select a medicine to delete")
            return
        
        item = self.manage_tree.item(selected[0])
        medicine_id = int(item['values'][0])
        medicine_name = item['values'][1]
        
        if messagebox.askyesno("Confirm", f"Delete {medicine_name}?"):
            medicines = self.load_medicines()
            medicines = [m for m in medicines if m['id'] != medicine_id]
            self.save_medicines(medicines)
            self.refresh_data()
            messagebox.showinfo("Success", f"Deleted {medicine_name}")
    
    def reset_daily_status(self):
        """Reset daily medicine status"""
        if messagebox.askyesno("Confirm", "Reset all medicines to 'not taken' status?"):
            medicines = self.load_medicines()
            for medicine in medicines:
                medicine['taken'] = False
            self.save_medicines(medicines)
            self.refresh_data()
            messagebox.showinfo("Success", "Daily status reset")
    
    def run(self):
        """Start the dashboard"""
        self.root.mainloop()

if __name__ == "__main__":
    dashboard = CaregiverDashboard()
    dashboard.run()