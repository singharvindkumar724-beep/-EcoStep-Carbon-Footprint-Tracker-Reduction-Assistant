import os
import subprocess
import shutil

def main():
    print("Step 1: Running create-next-app in temp-init...")
    cmd = [
        "npx", "-y", "create-next-app@15", "temp-init",
        "--typescript", "--tailwind", "--eslint", "--app", "--src-dir",
        "--import-alias", "@/*", "--use-npm", "--yes"
    ]
    
    # Run command in shell (required for npx on Windows)
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"Error initializing Next.js app: code {result.returncode}")
        return
        
    print("Step 2: Moving files from temp-init to project root...")
    temp_dir = "temp-init"
    for item in os.listdir(temp_dir):
        s = os.path.join(temp_dir, item)
        d = os.path.join(".", item)
        if os.path.isdir(s):
            if os.path.exists(d):
                shutil.rmtree(d)
            shutil.move(s, d)
        else:
            if os.path.exists(d):
                os.remove(d)
            shutil.move(s, d)
            
    print("Step 3: Cleaning up temp-init directory...")
    try:
        shutil.rmtree(temp_dir)
        print("Setup complete!")
    except Exception as e:
        print(f"Warning: could not delete temp-init: {e}")

if __name__ == "__main__":
    main()
