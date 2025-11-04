import requests
import time
import glob
import os

URL = "https://script.google.com/macros/s/AKfycbzlCZYkMbR36rmXfoUn9aYMvUMSecL8xKBGQ8PU14MFpsIb0OCKr53jVI2ZdNnP9b1s/exec"
folder = "C:\\CIP\\Dat\\Arduino"  # folderul unde Arduino salvează fișierele

while True:
    try:
        # găsim cel mai recent fișier .DAT sau .dat
        list_of_files = glob.glob(os.path.join(folder, "*.DAT")) + glob.glob(os.path.join(folder, "*.dat"))
        if not list_of_files:
            print("Nu există fișiere .DAT în folder")
            time.sleep(1)
            continue
        file_path = max(list_of_files, key=os.path.getctime)

        # citim linia ultima ne-goală
        with open(file_path) as f:
            lines = [line.strip() for line in f if line.strip()]
            last_row = lines[-1].split()  # împărțim după spațiu

            # timestamp = primele două elemente
            timestamp = last_row[0] + " " + last_row[1]

            # convertim valorile numerice, ignorând eventualele string-uri goale
            numeric_values = [float(val) if val else 0.0 for val in last_row[2:10]]

            data = {
                "timestamp": timestamp,
                "value1": numeric_values[0],
                "value2": numeric_values[1],
                "value3": numeric_values[2],
                "value4": numeric_values[3],
                "value5": numeric_values[4],
                "value6": numeric_values[5],
                "value7": numeric_values[6],
                "value8": numeric_values[7]
            }

        # trimite datele către Google Sheets / Apps Script
        response = requests.post(URL, json=data)
        print(response.json())

    except Exception as e:
        print("Eroare:", e)

    time.sleep(0.1)  # trimite datele la fiecare 0.1 secunde

