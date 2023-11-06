# Use Python 3.9
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy the application code to the container
COPY . /app

# Expose the port on which your Flask app will run
EXPOSE 5000

# Define the command to run your Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "quora-clone:app"]
