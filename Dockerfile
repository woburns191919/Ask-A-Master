FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y --no-install-recommends apt-utils && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install Pipenv
RUN pip3 install pipenv

# Install dependencies using Pipenv
RUN pipenv install --deploy --ignore-pipfile

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=app

# Run the Flask application
CMD ["pipenv", "run", "flask", "run", "--host=0.0.0.0"]
