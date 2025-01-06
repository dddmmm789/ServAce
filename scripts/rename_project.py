import os
import re
from pathlib import Path

def rename_in_file(file_path, replacements):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        for old, new in replacements:
            content = re.sub(old, new, content, flags=re.IGNORECASE)

        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
            
        print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")

def rename_files_and_folders(directory):
    replacements = [
        (r'locksmith[-_]network', 'servace-network'),
        (r'locksmith[-_]service', 'servace-service'),
        (r'locksmith[-_]db', 'servace-db'),
        (r'locksmith[-_]data', 'servace-data'),
        (r'locksmith[-_]admin', 'servace-admin'),
        (r'LOCKSMITH_SERVICE', 'SERVACE_SERVICE'),
        (r'LOCKSMITH_API', 'SERVACE_API'),
        (r'/locksmith/', '/servace/'),
        (r'locksmith_org', 'servace_org'),
        (r'Locksmith', 'ServiceProvider'),
        (r'locksmith', 'servace')
    ]

    # File extensions to process
    extensions = {'.js', '.jsx', '.ts', '.tsx', '.yml', '.yaml', '.env', '.json', '.md', '.css', '.html', '.conf'}

    for root, dirs, files in os.walk(directory):
        # Rename directories
        for dir_name in dirs:
            if 'locksmith' in dir_name.lower():
                old_path = os.path.join(root, dir_name)
                new_name = dir_name
                for old, new in replacements:
                    new_name = re.sub(old, new, new_name, flags=re.IGNORECASE)
                new_path = os.path.join(root, new_name)
                os.rename(old_path, new_path)
                print(f"Renamed directory: {old_path} -> {new_path}")

        # Process files
        for file_name in files:
            if Path(file_name).suffix in extensions:
                file_path = os.path.join(root, file_name)
                rename_in_file(file_path, replacements)

            # Rename files containing 'locksmith'
            if 'locksmith' in file_name.lower():
                old_path = os.path.join(root, file_name)
                new_name = file_name
                for old, new in replacements:
                    new_name = re.sub(old, new, new_name, flags=re.IGNORECASE)
                new_path = os.path.join(root, new_name)
                os.rename(old_path, new_path)
                print(f"Renamed file: {old_path} -> {new_path}")

if __name__ == "__main__":
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    rename_files_and_folders(project_root)
    print("Renaming complete!") 