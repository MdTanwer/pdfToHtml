# Use Ubuntu 20.04 as the base image
FROM ubuntu:20.04

# Set the working directory
WORKDIR /app

# Set non-interactive mode for apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install dependencies, including curl
RUN apt-get update && \
    apt-get install -y \
    curl \
    libfontconfig1 \
    libcairo2 \
    libjpeg-turbo8 \
    wget \
    && apt-get clean

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean


# Download and install pdf2htmlEX
RUN wget https://github.com/pdf2htmlEX/pdf2htmlEX/releases/download/v0.18.8.rc1/pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb && \
    mv pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb pdf2htmlEX.deb && \
    apt-get install -y ./pdf2htmlEX.deb && \
    rm pdf2htmlEX.deb


# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 8000

# Command to run your app
CMD ["node", "dist/app.js"]
